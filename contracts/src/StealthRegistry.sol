// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title StealthRegistry
 * @author NEXUS Protocol Team
 * @notice Username-based stealth payments on Polygon
 * @dev Implements a simplified stealth address protocol for the Polygon Buildathon
 * 
 * Key Features:
 * - Username registration with username format (3-20 chars, lowercase plus numbers plus underscore)
 * - Stealth-style payments routed by username
 * - Payment claiming with escrow-style holding
 * - Registration fee to prevent spam
 * 
 * Future Extensions:
 * - Full EIP-5564 stealth address support
 * - Viewing key integration
 * - ZK proof verification
 */
contract StealthRegistry is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ STRUCTS ============

    /**
     * @notice User profile data
     * @param owner The address that owns this username
     * @param stealthMetaAddressHash Hash of stealth meta-address (for future ZK integration)
     * @param registeredAt Timestamp of registration
     * @param isActive Whether the profile is active
     */
    struct UserProfile {
        address owner;
        bytes32 stealthMetaAddressHash;
        uint256 registeredAt;
        bool isActive;
    }

    /**
     * @notice Payment record
     * @param sender Address that initiated the payment
     * @param recipientUsername Username of the recipient
     * @param token ERC20 token address
     * @param amount Payment amount
     * @param ephemeralPubKeyHash Hash for future stealth key derivation
     * @param encryptedNote Optional encrypted message
     * @param claimed Whether payment has been claimed
     * @param timestamp When payment was created
     */
    struct Payment {
        address sender;
        string recipientUsername;
        address token;
        uint256 amount;
        bytes32 ephemeralPubKeyHash;
        string encryptedNote;
        bool claimed;
        uint256 timestamp;
    }

    // ============ STATE VARIABLES ============

    /// @notice Username => Profile mapping
    mapping(string => UserProfile) public profiles;
    
    /// @notice Address => Username mapping (reverse lookup)
    mapping(address => string) public addressToUsername;
    
    /// @notice Payment ID => Payment data
    mapping(bytes32 => Payment) public payments;
    
    /// @notice User address => Array of sent payment IDs
    mapping(address => bytes32[]) public sentPayments;
    
    /// @notice Username => Array of received payment IDs
    mapping(string => bytes32[]) public receivedPayments;

    /// @notice Registration fee in native MATIC
    uint256 public registrationFee = 0.01 ether;
    
    /// @notice Minimum username length
    uint256 public constant MIN_USERNAME_LENGTH = 3;
    
    /// @notice Maximum username length
    uint256 public constant MAX_USERNAME_LENGTH = 20;

    // ============ EVENTS ============

    /// @notice Emitted when a new username is registered
    event UsernameRegistered(string indexed username, address indexed owner);
    
    /// @notice Emitted when a payment is created
    event PaymentCreated(
        bytes32 indexed paymentId,
        address indexed sender,
        string recipientUsername,
        address token,
        uint256 amount
    );
    
    /// @notice Emitted when a payment is claimed
    event PaymentClaimed(bytes32 indexed paymentId, address indexed claimer, uint256 amount);

    // ============ CONSTRUCTOR ============

    constructor() Ownable(msg.sender) {}

    // ============ REGISTRATION FUNCTIONS ============

    /**
     * @notice Registers a new username for the caller
     * @param username The desired username (3-20 chars, lowercase alphanumeric + underscore)
     * @param stealthMetaAddressHash Hash of stealth meta-address for future ZK integration
     */
    function registerUsername(
        string calldata username,
        bytes32 stealthMetaAddressHash
    ) external payable nonReentrant {
        require(msg.value >= registrationFee, "Insufficient fee");
        require(_isValidUsername(username), "Invalid username format");
        require(profiles[username].owner == address(0), "Username taken");
        require(bytes(addressToUsername[msg.sender]).length == 0, "Already registered");

        // Create profile
        profiles[username] = UserProfile({
            owner: msg.sender,
            stealthMetaAddressHash: stealthMetaAddressHash,
            registeredAt: block.timestamp,
            isActive: true
        });

        // Set reverse mapping
        addressToUsername[msg.sender] = username;

        emit UsernameRegistered(username, msg.sender);

        // Refund excess payment
        if (msg.value > registrationFee) {
            payable(msg.sender).transfer(msg.value - registrationFee);
        }
    }

    /**
     * @notice Validates username format
     * @param username The username to validate
     * @return isValid True if username is valid
     */
    function _isValidUsername(string calldata username) internal pure returns (bool) {
        bytes memory b = bytes(username);
        
        // Check length
        if (b.length < MIN_USERNAME_LENGTH || b.length > MAX_USERNAME_LENGTH) {
            return false;
        }
        
        // Check each character: lowercase letters, numbers, underscore only
        for (uint256 i = 0; i < b.length; i++) {
            bytes1 char = b[i];
            bool isLowercase = (char >= 0x61 && char <= 0x7A); // a-z
            bool isNumber = (char >= 0x30 && char <= 0x39);    // 0-9
            bool isUnderscore = (char == 0x5F);                 // _
            
            if (!isLowercase && !isNumber && !isUnderscore) {
                return false;
            }
        }
        return true;
    }

    // ============ PAYMENT FUNCTIONS ============

    /**
     * @notice Sends a payment to a username
     * @param recipientUsername The recipient's username
     * @param token The ERC20 token to send
     * @param amount The amount to send
     * @param ephemeralPubKeyHash Hash for stealth key derivation (future use)
     * @param encryptedNote Optional encrypted message
     * @return paymentId The unique payment identifier
     */
    function sendPayment(
        string calldata recipientUsername,
        address token,
        uint256 amount,
        bytes32 ephemeralPubKeyHash,
        string calldata encryptedNote
    ) external nonReentrant returns (bytes32) {
        require(profiles[recipientUsername].isActive, "Recipient not found");
        require(amount > 0, "Amount must be > 0");
        require(token != address(0), "Invalid token");

        // Transfer tokens to contract (escrow)
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Generate unique payment ID
        bytes32 paymentId = keccak256(abi.encodePacked(
            msg.sender,
            recipientUsername,
            token,
            amount,
            block.timestamp,
            block.number
        ));

        // Store payment
        payments[paymentId] = Payment({
            sender: msg.sender,
            recipientUsername: recipientUsername,
            token: token,
            amount: amount,
            ephemeralPubKeyHash: ephemeralPubKeyHash,
            encryptedNote: encryptedNote,
            claimed: false,
            timestamp: block.timestamp
        });

        // Track payment for both parties
        sentPayments[msg.sender].push(paymentId);
        receivedPayments[recipientUsername].push(paymentId);

        emit PaymentCreated(paymentId, msg.sender, recipientUsername, token, amount);
        return paymentId;
    }

    /**
     * @notice Claims a pending payment
     * @param paymentId The payment ID to claim
     */
    function claimPayment(bytes32 paymentId) external nonReentrant {
        Payment storage payment = payments[paymentId];
        
        require(!payment.claimed, "Already claimed");
        require(payment.amount > 0, "Payment not found");
        
        // Verify claimer owns the recipient username
        string memory username = addressToUsername[msg.sender];
        require(
            keccak256(bytes(username)) == keccak256(bytes(payment.recipientUsername)),
            "Not authorized"
        );

        // Mark as claimed and transfer
        payment.claimed = true;
        IERC20(payment.token).safeTransfer(msg.sender, payment.amount);

        emit PaymentClaimed(paymentId, msg.sender, payment.amount);
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Checks if a username is available
     * @param username The username to check
     * @return available True if username is available and valid
     */
    function isUsernameAvailable(string calldata username) external view returns (bool) {
        return profiles[username].owner == address(0) && _isValidUsername(username);
    }

    /**
     * @notice Gets a user's profile
     * @param username The username to look up
     * @return owner Profile owner address
     * @return stealthMetaAddressHash Stealth meta-address hash
     * @return registeredAt Registration timestamp
     * @return isActive Whether profile is active
     */
    function getProfile(string calldata username) external view returns (
        address owner,
        bytes32 stealthMetaAddressHash,
        uint256 registeredAt,
        bool isActive
    ) {
        UserProfile memory profile = profiles[username];
        return (profile.owner, profile.stealthMetaAddressHash, profile.registeredAt, profile.isActive);
    }

    /**
     * @notice Gets a payment by ID
     * @param paymentId The payment ID
     * @return The payment struct
     */
    function getPayment(bytes32 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }

    /**
     * @notice Gets all payments sent by a user
     * @param user The sender address
     * @return Array of payment IDs
     */
    function getSentPayments(address user) external view returns (bytes32[] memory) {
        return sentPayments[user];
    }

    /**
     * @notice Gets all payments received by a username
     * @param username The recipient username
     * @return Array of payment IDs
     */
    function getReceivedPayments(string calldata username) external view returns (bytes32[] memory) {
        return receivedPayments[username];
    }

    /**
     * @notice Gets pending (unclaimed) payments for a username
     * @param username The recipient username
     * @return paymentIds Array of pending payment IDs
     * @return totalPending Total pending amount (assumes single token)
     */
    function getPendingPayments(string calldata username) external view returns (
        bytes32[] memory paymentIds,
        uint256 totalPending
    ) {
        bytes32[] memory all = receivedPayments[username];
        uint256 pendingCount = 0;
        
        // Count pending payments
        for (uint256 i = 0; i < all.length; i++) {
            if (!payments[all[i]].claimed) {
                pendingCount++;
            }
        }
        
        // Build array of pending payment IDs
        paymentIds = new bytes32[](pendingCount);
        uint256 index = 0;
        for (uint256 i = 0; i < all.length; i++) {
            if (!payments[all[i]].claimed) {
                paymentIds[index] = all[i];
                totalPending += payments[all[i]].amount;
                index++;
            }
        }
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @notice Updates the registration fee
     * @param _fee New fee in wei
     */
    function setRegistrationFee(uint256 _fee) external onlyOwner {
        registrationFee = _fee;
    }

    /**
     * @notice Withdraws collected registration fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }
}
