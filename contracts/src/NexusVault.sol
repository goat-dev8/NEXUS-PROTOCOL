// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title IAavePool
 * @notice Interface for Aave V3 Pool on Polygon
 */
interface IAavePool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
}

/**
 * @title IAToken
 * @notice Interface for Aave aTokens
 */
interface IAToken {
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title NexusVault
 * @author NEXUS Protocol Team
 * @notice Yield vault that deposits into Aave V3 on Polygon
 * @dev ERC4626 compliant vault with real Aave integration for the Polygon Buildathon
 * 
 * Key Features:
 * - Accepts stablecoin deposits (USDC, USDT, DAI)
 * - Automatically supplies to Aave V3 for yield generation
 * - Configurable fees (deposit/withdraw) capped at 5%
 * - Emergency withdrawal for admin
 * - ReentrancyGuard for security
 */
contract NexusVault is ERC4626, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ CONSTANTS ============
    
    /// @notice Aave V3 Pool on Polygon Mainnet
    IAavePool public constant AAVE_POOL = IAavePool(0x794a61358D6845594F94dc1DB02A252b5b4814aD);
    
    /// @notice Maximum fee in basis points (5%)
    uint256 public constant MAX_FEE = 500;
    
    /// @notice Basis points denominator
    uint256 public constant BPS_DENOMINATOR = 10000;

    // ============ STATE VARIABLES ============
    
    /// @notice Corresponding aToken for the underlying asset
    IAToken public aToken;
    
    /// @notice Vault description for frontend display
    string public vaultDescription;
    
    /// @notice Risk level: 1 = Low, 2 = Medium, 3 = High
    uint8 public riskLevel;
    
    /// @notice Deposit fee in basis points (100 = 1%)
    uint256 public depositFeeBps = 10; // 0.1%
    
    /// @notice Withdraw fee in basis points
    uint256 public withdrawFeeBps = 10; // 0.1%
    
    /// @notice Address to receive collected fees
    address public feeRecipient;
    
    /// @notice Total fees collected in underlying asset
    uint256 public totalFeesCollected;

    // ============ EVENTS ============
    
    /// @notice Emitted on successful deposit
    event NexusDeposit(address indexed user, uint256 assets, uint256 shares, uint256 fee);
    
    /// @notice Emitted on successful withdrawal
    event NexusWithdraw(address indexed user, uint256 assets, uint256 shares, uint256 fee);
    
    /// @notice Emitted when fees are updated
    event FeesUpdated(uint256 depositFee, uint256 withdrawFee);
    
    /// @notice Emitted on emergency withdrawal
    event EmergencyWithdraw(address indexed owner, uint256 amount);

    // ============ CONSTRUCTOR ============
    
    /**
     * @notice Creates a new NexusVault
     * @param _asset The underlying ERC20 token (e.g., USDC)
     * @param _aToken The corresponding Aave aToken
     * @param _name Vault token name
     * @param _symbol Vault token symbol
     * @param _description Human-readable vault description
     * @param _riskLevel Risk level (1-3)
     */
    constructor(
        IERC20 _asset,
        IAToken _aToken,
        string memory _name,
        string memory _symbol,
        string memory _description,
        uint8 _riskLevel
    ) ERC4626(_asset) ERC20(_name, _symbol) Ownable(msg.sender) {
        require(address(_aToken) != address(0), "Invalid aToken");
        require(_riskLevel >= 1 && _riskLevel <= 3, "Invalid risk level");
        
        aToken = _aToken;
        vaultDescription = _description;
        riskLevel = _riskLevel;
        feeRecipient = msg.sender;
        
        // Approve Aave pool to spend underlying asset
        _asset.approve(address(AAVE_POOL), type(uint256).max);
    }

    // ============ CORE FUNCTIONS ============

    /**
     * @notice Deposits assets and mints vault shares
     * @param assets Amount of underlying asset to deposit
     * @param receiver Address to receive vault shares
     * @return shares Amount of shares minted
     */
    function deposit(uint256 assets, address receiver) public override nonReentrant returns (uint256) {
        require(assets > 0, "Cannot deposit 0");
        require(receiver != address(0), "Invalid receiver");
        
        // Calculate and collect fee
        uint256 fee = (assets * depositFeeBps) / BPS_DENOMINATOR;
        uint256 assetsAfterFee = assets - fee;
        
        // Transfer fee to recipient
        if (fee > 0) {
            IERC20(asset()).safeTransferFrom(msg.sender, feeRecipient, fee);
            totalFeesCollected += fee;
        }
        
        // Transfer assets from user
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), assetsAfterFee);
        
        // Supply to Aave V3
        AAVE_POOL.supply(asset(), assetsAfterFee, address(this), 0);
        
        // Mint shares based on assets after fee
        uint256 shares = previewDeposit(assetsAfterFee);
        _mint(receiver, shares);
        
        emit NexusDeposit(receiver, assets, shares, fee);
        return shares;
    }

    /**
     * @notice Withdraws assets by burning vault shares
     * @param assets Amount of underlying asset to withdraw
     * @param receiver Address to receive assets
     * @param owner Address that owns the shares
     * @return shares Amount of shares burned
     */
    function withdraw(uint256 assets, address receiver, address owner) public override nonReentrant returns (uint256) {
        require(assets > 0, "Cannot withdraw 0");
        require(receiver != address(0), "Invalid receiver");
        
        uint256 shares = previewWithdraw(assets);
        
        // Check allowance if caller is not owner
        if (msg.sender != owner) {
            _spendAllowance(owner, msg.sender, shares);
        }
        
        // Withdraw from Aave
        AAVE_POOL.withdraw(asset(), assets, address(this));
        
        // Calculate fee
        uint256 fee = (assets * withdrawFeeBps) / BPS_DENOMINATOR;
        uint256 assetsAfterFee = assets - fee;
        
        // Transfer fee to recipient
        if (fee > 0) {
            IERC20(asset()).safeTransfer(feeRecipient, fee);
            totalFeesCollected += fee;
        }
        
        // Burn shares and transfer assets
        _burn(owner, shares);
        IERC20(asset()).safeTransfer(receiver, assetsAfterFee);
        
        emit NexusWithdraw(receiver, assets, shares, fee);
        return shares;
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Returns total assets held by the vault (in Aave)
     * @return Total assets in underlying token
     */
    function totalAssets() public view override returns (uint256) {
        return aToken.balanceOf(address(this));
    }

    /**
     * @notice Returns comprehensive vault information for frontend
     * @return vaultName Vault token name
     * @return vaultSymbol Vault token symbol  
     * @return description Human-readable description
     * @return assetAddress Underlying asset address
     * @return tvl Total value locked
     * @return apy Current APY in basis points
     * @return risk Risk level (1-3)
     * @return totalShares Total shares outstanding
     */
    function getVaultInfo() external view returns (
        string memory vaultName,
        string memory vaultSymbol,
        string memory description,
        address assetAddress,
        uint256 tvl,
        uint256 apy,
        uint8 risk,
        uint256 totalShares
    ) {
        return (
            ERC20.name(),
            ERC20.symbol(),
            vaultDescription,
            asset(),
            totalAssets(),
            getCurrentAPY(),
            riskLevel,
            totalSupply()
        );
    }

    /**
     * @notice Returns current APY in basis points
     * @dev In production, this would query Aave's actual rate
     * @return APY in basis points (450 = 4.5%)
     */
    function getCurrentAPY() public pure returns (uint256) {
        // Base APY for stablecoins on Aave V3 Polygon
        // In a full implementation, query Aave's getReserveData()
        return 450; // 4.5%
    }

    /**
     * @notice Returns a user's position in the vault
     * @param user Address to query
     * @return shares User's share balance
     * @return assets User's underlying asset value
     * @return pendingYield Estimated pending yield
     */
    function getUserPosition(address user) external view returns (
        uint256 shares,
        uint256 assets,
        uint256 pendingYield
    ) {
        shares = balanceOf(user);
        assets = convertToAssets(shares);
        // Pending yield would require deposit tracking
        pendingYield = 0;
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @notice Updates deposit and withdraw fees
     * @param _depositFee New deposit fee in basis points
     * @param _withdrawFee New withdraw fee in basis points
     */
    function setFees(uint256 _depositFee, uint256 _withdrawFee) external onlyOwner {
        require(_depositFee <= MAX_FEE && _withdrawFee <= MAX_FEE, "Fee too high");
        depositFeeBps = _depositFee;
        withdrawFeeBps = _withdrawFee;
        emit FeesUpdated(_depositFee, _withdrawFee);
    }

    /**
     * @notice Updates the fee recipient address
     * @param _recipient New fee recipient
     */
    function setFeeRecipient(address _recipient) external onlyOwner {
        require(_recipient != address(0), "Invalid address");
        feeRecipient = _recipient;
    }

    /**
     * @notice Emergency withdrawal of all funds to owner
     * @dev Only use in emergency situations
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = aToken.balanceOf(address(this));
        if (balance > 0) {
            AAVE_POOL.withdraw(asset(), balance, owner());
            emit EmergencyWithdraw(owner(), balance);
        }
    }
}
