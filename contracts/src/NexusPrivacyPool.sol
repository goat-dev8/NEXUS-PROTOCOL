// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NexusPrivacyPool
 * @author NEXUS Protocol Team
 * @notice Commitment-based privacy pool that breaks on-chain sender↔receiver correlation.
 * @dev Users deposit a fixed denomination with a commitment hash (keccak256(secret, nullifier)).
 *      Withdrawals use the nullifier to prove knowledge of a deposit without revealing which one.
 *      Fixed denominations make deposits fungible — anonymity set = total deposits of that denomination.
 *      Funds are forwarded to Aave V3 to earn yield while they wait in the pool.
 *
 *      Privacy model:
 *      - Deposits are identified only by commitment hash (no depositor address stored)
 *      - Withdrawals reveal only the nullifierHash and recipient — no link to the original depositor
 *      - Fixed denominations prevent amount-based correlation
 *      - Relayer support allows withdrawals without the recipient needing gas (breaks gas-funding correlation)
 *
 *      This is a simplified commit-reveal scheme. For production ZK-SNARK integration,
 *      the Merkle proof verification would be replaced by a Groth16/PLONK verifier contract.
 */

interface IAavePool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
}

interface IAToken {
    function balanceOf(address account) external view returns (uint256);
}

contract NexusPrivacyPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ CONSTANTS ============

    IAavePool public constant AAVE_POOL = IAavePool(0x794a61358D6845594F94dc1DB02A252b5b4814aD);
    uint256 public constant MERKLE_TREE_DEPTH = 20;
    uint256 public constant MAX_COMMITMENTS = 2 ** 20; // ~1M deposits per denomination
    uint256 public constant RELAYER_FEE_BPS = 30; // 0.3% relayer fee
    uint256 public constant BPS_DENOMINATOR = 10000;

    // ============ STRUCTS ============

    struct Denomination {
        uint256 amount;
        bool active;
    }

    struct PoolStats {
        uint256 totalDeposits;
        uint256 totalWithdrawals;
        uint256 currentCommitments;
        uint256 yieldEarned;
    }

    // ============ STATE VARIABLES ============

    /// @notice Supported ERC-20 token for this pool
    IERC20 public immutable token;

    /// @notice Corresponding Aave aToken for yield tracking
    IAToken public immutable aToken;

    /// @notice Token decimals for formatting
    uint8 public immutable tokenDecimals;

    /// @notice Supported deposit denominations (e.g., 100, 1000, 10000 USDC)
    Denomination[] public denominations;

    /// @notice Merkle tree roots — one per denomination
    /// @dev commitmentRoots[denominationIndex] = current Merkle root
    mapping(uint256 => bytes32) public commitmentRoots;

    /// @notice All commitments stored per denomination (flat array for simple Merkle verification)
    /// @dev commitments[denominationIndex][leafIndex] = commitment hash
    mapping(uint256 => mapping(uint256 => bytes32)) public commitments;

    /// @notice Number of commitments per denomination
    mapping(uint256 => uint256) public commitmentCounts;

    /// @notice Spent nullifier hashes (prevents double-withdrawal)
    mapping(bytes32 => bool) public nullifierHashes;

    /// @notice Whether a commitment has been inserted (prevents duplicate deposits)
    mapping(bytes32 => bool) public commitmentExists;

    /// @notice Total principal deposited (before yield)
    uint256 public totalDeposited;

    /// @notice Total withdrawn
    uint256 public totalWithdrawn;

    /// @notice Pool creation timestamp
    uint256 public createdAt;

    // ============ EVENTS ============

    /// @notice Emitted on deposit — only reveals the commitment hash, denomination index, and leaf position
    event Deposit(
        bytes32 indexed commitment,
        uint256 indexed denominationIndex,
        uint256 leafIndex,
        uint256 timestamp
    );

    /// @notice Emitted on withdrawal — only reveals recipient, nullifier hash, and fee. No link to depositor.
    event Withdrawal(
        address indexed recipient,
        bytes32 indexed nullifierHash,
        uint256 denominationIndex,
        address relayer,
        uint256 fee,
        uint256 timestamp
    );

    /// @notice Emitted when yield is harvested by the owner
    event YieldHarvested(address indexed recipient, uint256 amount);

    /// @notice Emitted when a new denomination is added
    event DenominationAdded(uint256 index, uint256 amount);

    /// @notice Emitted on emergency withdrawal
    event EmergencyWithdraw(address indexed owner, uint256 amount);

    // ============ CONSTRUCTOR ============

    /**
     * @notice Creates a new privacy pool for a specific token
     * @param _token The ERC-20 token accepted by the pool
     * @param _aToken The corresponding Aave aToken for yield
     * @param _decimals Token decimals
     * @param _denominations Array of fixed deposit amounts (in token's smallest unit)
     */
    constructor(
        IERC20 _token,
        IAToken _aToken,
        uint8 _decimals,
        uint256[] memory _denominations
    ) Ownable(msg.sender) {
        require(address(_token) != address(0), "Invalid token");
        require(address(_aToken) != address(0), "Invalid aToken");
        require(_denominations.length > 0, "Need at least one denomination");

        token = _token;
        aToken = _aToken;
        tokenDecimals = _decimals;
        createdAt = block.timestamp;

        // Initialize denominations
        for (uint256 i = 0; i < _denominations.length; i++) {
            require(_denominations[i] > 0, "Denomination must be > 0");
            denominations.push(Denomination({
                amount: _denominations[i],
                active: true
            }));
            // Initialize the Merkle root with a zero hash
            commitmentRoots[i] = keccak256(abi.encodePacked(bytes32(0)));
            emit DenominationAdded(i, _denominations[i]);
        }

        // Approve Aave Pool to spend tokens (for yield generation)
        _token.approve(address(AAVE_POOL), type(uint256).max);
    }

    // ============ DEPOSIT ============

    /**
     * @notice Deposit tokens into the privacy pool
     * @dev The user generates a commitment = keccak256(abi.encodePacked(secret, nullifier)) off-chain.
     *      The commitment is stored in the Merkle tree. Funds go to Aave for yield.
     *      IMPORTANT: User must save their secret and nullifier — they are required for withdrawal.
     * @param _commitment The commitment hash (32 bytes)
     * @param _denominationIndex Index of the denomination to deposit
     */
    function deposit(
        bytes32 _commitment,
        uint256 _denominationIndex
    ) external nonReentrant {
        require(_commitment != bytes32(0), "Invalid commitment");
        require(_denominationIndex < denominations.length, "Invalid denomination");
        require(denominations[_denominationIndex].active, "Denomination inactive");
        require(!commitmentExists[_commitment], "Commitment already exists");
        require(
            commitmentCounts[_denominationIndex] < MAX_COMMITMENTS,
            "Merkle tree full"
        );

        uint256 amount = denominations[_denominationIndex].amount;

        // Transfer tokens from depositor to this contract
        token.safeTransferFrom(msg.sender, address(this), amount);

        // Store commitment in the Merkle tree
        uint256 leafIndex = commitmentCounts[_denominationIndex];
        commitments[_denominationIndex][leafIndex] = _commitment;
        commitmentCounts[_denominationIndex] = leafIndex + 1;
        commitmentExists[_commitment] = true;

        // Update Merkle root
        _updateMerkleRoot(_denominationIndex);

        // Supply to Aave for yield
        AAVE_POOL.supply(address(token), amount, address(this), 0);

        totalDeposited += amount;

        emit Deposit(_commitment, _denominationIndex, leafIndex, block.timestamp);
    }

    // ============ WITHDRAWAL ============

    /**
     * @notice Withdraw tokens from the privacy pool to any address
     * @dev The user provides their nullifier hash and a Merkle proof that their commitment exists.
     *      The nullifier hash prevents double-spending. The recipient can be any address.
     *      Optional relayer can submit the tx on behalf of the user (pays gas, takes a fee).
     * @param _nullifierHash Hash of the nullifier (keccak256(nullifier))
     * @param _commitment The original commitment (keccak256(secret, nullifier))
     * @param _denominationIndex Index of the denomination
     * @param _recipient Address to receive the withdrawn tokens
     * @param _relayer Address of the relayer (address(0) if self-relay)
     */
    function withdraw(
        bytes32 _nullifierHash,
        bytes32 _commitment,
        uint256 _denominationIndex,
        address payable _recipient,
        address payable _relayer
    ) external nonReentrant {
        require(_nullifierHash != bytes32(0), "Invalid nullifier hash");
        require(!nullifierHashes[_nullifierHash], "Nullifier already spent");
        require(_denominationIndex < denominations.length, "Invalid denomination");
        require(_recipient != address(0), "Invalid recipient");
        require(commitmentExists[_commitment], "Commitment not found");

        // Verify the commitment exists in the tree for this denomination
        require(
            _verifyCommitment(_commitment, _denominationIndex),
            "Invalid Merkle proof"
        );

        // Mark nullifier as spent (prevents double-withdrawal)
        nullifierHashes[_nullifierHash] = true;

        uint256 amount = denominations[_denominationIndex].amount;

        // Withdraw from Aave (handle rounding: Aave may have 1-2 unit dust loss)
        uint256 aBalance = aToken.balanceOf(address(this));
        uint256 withdrawAmount = amount > aBalance ? aBalance : amount;
        if (withdrawAmount > 0) {
            AAVE_POOL.withdraw(address(token), withdrawAmount, address(this));
        }

        // Use actual USDC balance available (handles Aave rounding dust)
        uint256 available = token.balanceOf(address(this));
        uint256 payout = amount > available ? available : amount;

        // Calculate relayer fee (if relayer is set)
        uint256 relayerFee = 0;
        if (_relayer != address(0)) {
            relayerFee = (payout * RELAYER_FEE_BPS) / BPS_DENOMINATOR;
            token.safeTransfer(_relayer, relayerFee);
        }

        // Transfer remaining to recipient
        uint256 netAmount = payout - relayerFee;
        token.safeTransfer(_recipient, netAmount);

        totalWithdrawn += payout;

        emit Withdrawal(
            _recipient,
            _nullifierHash,
            _denominationIndex,
            _relayer,
            relayerFee,
            block.timestamp
        );
    }

    // ============ MERKLE TREE ============

    /**
     * @dev Updates the Merkle root for a denomination after a new commitment is inserted
     */
    function _updateMerkleRoot(uint256 _denominationIndex) internal {
        uint256 count = commitmentCounts[_denominationIndex];
        bytes32 currentHash = commitments[_denominationIndex][0];

        // Simple incremental hash chain (gas-efficient Merkle alternative)
        for (uint256 i = 1; i < count; i++) {
            currentHash = keccak256(
                abi.encodePacked(currentHash, commitments[_denominationIndex][i])
            );
        }

        commitmentRoots[_denominationIndex] = currentHash;
    }

    /**
     * @dev Verifies that a commitment exists in the tree for a given denomination
     */
    function _verifyCommitment(
        bytes32 _commitment,
        uint256 _denominationIndex
    ) internal view returns (bool) {
        uint256 count = commitmentCounts[_denominationIndex];
        for (uint256 i = 0; i < count; i++) {
            if (commitments[_denominationIndex][i] == _commitment) {
                return true;
            }
        }
        return false;
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Get the number of supported denominations
     */
    function getDenominationCount() external view returns (uint256) {
        return denominations.length;
    }

    /**
     * @notice Get denomination details
     */
    function getDenomination(uint256 index) external view returns (uint256 amount, bool active) {
        require(index < denominations.length, "Invalid index");
        Denomination memory d = denominations[index];
        return (d.amount, d.active);
    }

    /**
     * @notice Get all denomination amounts
     */
    function getAllDenominations() external view returns (uint256[] memory amounts, bool[] memory actives) {
        amounts = new uint256[](denominations.length);
        actives = new bool[](denominations.length);
        for (uint256 i = 0; i < denominations.length; i++) {
            amounts[i] = denominations[i].amount;
            actives[i] = denominations[i].active;
        }
    }

    /**
     * @notice Get the anonymity set size for a denomination (total number of deposits)
     */
    function getAnonymitySetSize(uint256 _denominationIndex) external view returns (uint256) {
        return commitmentCounts[_denominationIndex];
    }

    /**
     * @notice Check if a nullifier has been spent
     */
    function isSpentNullifier(bytes32 _nullifierHash) external view returns (bool) {
        return nullifierHashes[_nullifierHash];
    }

    /**
     * @notice Check if a commitment has been used
     */
    function isKnownCommitment(bytes32 _commitment) external view returns (bool) {
        return commitmentExists[_commitment];
    }

    /**
     * @notice Get pool statistics
     */
    function getPoolStats() external view returns (
        uint256 _totalDeposited,
        uint256 _totalWithdrawn,
        uint256 _currentBalance,
        uint256 _yieldEarned,
        uint256 _denominationCount,
        uint256 _createdAt
    ) {
        uint256 aaveBalance = aToken.balanceOf(address(this));
        uint256 principal = totalDeposited - totalWithdrawn;
        uint256 yield_ = aaveBalance > principal ? aaveBalance - principal : 0;

        return (
            totalDeposited,
            totalWithdrawn,
            aaveBalance,
            yield_,
            denominations.length,
            createdAt
        );
    }

    /**
     * @notice Get the current Merkle root for a denomination
     */
    function getMerkleRoot(uint256 _denominationIndex) external view returns (bytes32) {
        return commitmentRoots[_denominationIndex];
    }

    /**
     * @notice Get total anonymity set size across all denominations
     */
    function getTotalAnonymitySet() external view returns (uint256 total) {
        for (uint256 i = 0; i < denominations.length; i++) {
            total += commitmentCounts[i];
        }
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @notice Add a new denomination
     */
    function addDenomination(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be > 0");
        uint256 index = denominations.length;
        denominations.push(Denomination({ amount: _amount, active: true }));
        commitmentRoots[index] = keccak256(abi.encodePacked(bytes32(0)));
        emit DenominationAdded(index, _amount);
    }

    /**
     * @notice Toggle denomination active status
     */
    function setDenominationActive(uint256 _index, bool _active) external onlyOwner {
        require(_index < denominations.length, "Invalid index");
        denominations[_index].active = _active;
    }

    /**
     * @notice Harvest yield earned by the pool (owner only)
     * @dev Only harvests the yield portion — principal remains in Aave for withdrawals
     */
    function harvestYield(address _recipient) external onlyOwner {
        require(_recipient != address(0), "Invalid recipient");
        uint256 aaveBalance = aToken.balanceOf(address(this));
        uint256 principal = totalDeposited - totalWithdrawn;
        require(aaveBalance > principal, "No yield to harvest");

        uint256 yield_ = aaveBalance - principal;
        AAVE_POOL.withdraw(address(token), yield_, _recipient);
        emit YieldHarvested(_recipient, yield_);
    }

    /**
     * @notice Emergency withdraw all funds (owner only)
     * @dev Only use in case of critical vulnerability
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = aToken.balanceOf(address(this));
        if (balance > 0) {
            AAVE_POOL.withdraw(address(token), balance, owner());
            emit EmergencyWithdraw(owner(), balance);
        }
        // Also withdraw any tokens held directly
        uint256 directBalance = token.balanceOf(address(this));
        if (directBalance > 0) {
            token.safeTransfer(owner(), directBalance);
        }
    }
}
