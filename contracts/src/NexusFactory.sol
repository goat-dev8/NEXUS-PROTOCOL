// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./NexusVault.sol";

/**
 * @title NexusFactory
 * @author NEXUS Protocol Team
 * @notice Factory contract for creating and managing NEXUS vaults
 * @dev Deploys new ERC4626 vaults for different assets
 */
contract NexusFactory is Ownable {
    
    // ============ STATE VARIABLES ============
    
    /// @notice Array of all deployed vault addresses
    address[] public vaults;
    
    /// @notice Mapping from asset address to vault address
    mapping(address => address) public assetToVault;
    
    // ============ EVENTS ============
    
    /// @notice Emitted when a new vault is created
    event VaultCreated(
        address indexed vault,
        address indexed asset,
        string name,
        string symbol
    );

    // ============ CONSTRUCTOR ============
    
    constructor() Ownable(msg.sender) {}

    // ============ FACTORY FUNCTIONS ============

    /**
     * @notice Creates a new NEXUS vault for an asset
     * @param asset The underlying ERC20 token
     * @param aToken The corresponding Aave aToken
     * @param name Vault token name
     * @param symbol Vault token symbol
     * @param description Human-readable vault description
     * @param riskLevel Risk level (1-3)
     * @return vault Address of the newly created vault
     */
    function createVault(
        IERC20 asset,
        IAToken aToken,
        string memory name,
        string memory symbol,
        string memory description,
        uint8 riskLevel
    ) external onlyOwner returns (address) {
        require(assetToVault[address(asset)] == address(0), "Vault exists for asset");
        
        // Deploy new vault
        NexusVault vault = new NexusVault(
            asset,
            aToken,
            name,
            symbol,
            description,
            riskLevel
        );
        
        // Transfer ownership to factory owner
        vault.transferOwnership(msg.sender);
        
        // Track vault
        address vaultAddress = address(vault);
        vaults.push(vaultAddress);
        assetToVault[address(asset)] = vaultAddress;
        
        emit VaultCreated(vaultAddress, address(asset), name, symbol);
        return vaultAddress;
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Returns all deployed vault addresses
     * @return Array of vault addresses
     */
    function getAllVaults() external view returns (address[] memory) {
        return vaults;
    }

    /**
     * @notice Returns the number of deployed vaults
     * @return Number of vaults
     */
    function getVaultCount() external view returns (uint256) {
        return vaults.length;
    }

    /**
     * @notice Gets vault address for a specific asset
     * @param asset The asset address
     * @return Vault address (zero if not exists)
     */
    function getVaultForAsset(address asset) external view returns (address) {
        return assetToVault[asset];
    }
}
