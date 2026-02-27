/**
 * NEXUS Protocol Contract ABIs
 * Auto-generated from deployed contracts on Polygon Mainnet
 * Wave 6 — includes Privacy Pool
 */

// ============ NEXUS VAULT ABI ============

export const NEXUS_VAULT_ABI = [
  // Core ERC4626 Functions
  {
    inputs: [
      { name: "assets", type: "uint256" },
      { name: "receiver", type: "address" },
    ],
    name: "deposit",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "assets", type: "uint256" },
      { name: "receiver", type: "address" },
      { name: "owner", type: "address" },
    ],
    name: "withdraw",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "shares", type: "uint256" },
      { name: "receiver", type: "address" },
      { name: "owner", type: "address" },
    ],
    name: "redeem",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // View Functions
  {
    inputs: [],
    name: "totalAssets",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "shares", type: "uint256" }],
    name: "convertToAssets",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "assets", type: "uint256" }],
    name: "convertToShares",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "assets", type: "uint256" }],
    name: "previewDeposit",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "assets", type: "uint256" }],
    name: "previewWithdraw",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVaultInfo",
    outputs: [
      { name: "vaultName", type: "string" },
      { name: "vaultSymbol", type: "string" },
      { name: "description", type: "string" },
      { name: "assetAddress", type: "address" },
      { name: "tvl", type: "uint256" },
      { name: "apy", type: "uint256" },
      { name: "risk", type: "uint8" },
      { name: "totalShares", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getUserPosition",
    outputs: [
      { name: "shares", type: "uint256" },
      { name: "assets", type: "uint256" },
      { name: "pendingYield", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "asset",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentAPY",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "depositFeeBps",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawFeeBps",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "riskLevel",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vaultDescription",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "assets", type: "uint256" },
      { indexed: false, name: "shares", type: "uint256" },
      { indexed: false, name: "fee", type: "uint256" },
    ],
    name: "NexusDeposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "user", type: "address" },
      { indexed: false, name: "assets", type: "uint256" },
      { indexed: false, name: "shares", type: "uint256" },
      { indexed: false, name: "fee", type: "uint256" },
    ],
    name: "NexusWithdraw",
    type: "event",
  },
] as const;

// ============ STEALTH REGISTRY ABI ============

export const STEALTH_REGISTRY_ABI = [
  // Registration
  {
    inputs: [
      { name: "username", type: "string" },
      { name: "stealthMetaAddressHash", type: "bytes32" },
    ],
    name: "registerUsername",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  // Payments
  {
    inputs: [
      { name: "recipientUsername", type: "string" },
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "ephemeralPubKeyHash", type: "bytes32" },
      { name: "encryptedNote", type: "string" },
    ],
    name: "sendPayment",
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "paymentId", type: "bytes32" }],
    name: "claimPayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // View Functions
  {
    inputs: [{ name: "username", type: "string" }],
    name: "isUsernameAvailable",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "username", type: "string" }],
    name: "getProfile",
    outputs: [
      { name: "owner", type: "address" },
      { name: "stealthMetaAddressHash", type: "bytes32" },
      { name: "registeredAt", type: "uint256" },
      { name: "isActive", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "addressToUsername",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "username", type: "string" }],
    name: "getPendingPayments",
    outputs: [
      { name: "paymentIds", type: "bytes32[]" },
      { name: "totalPending", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "paymentId", type: "bytes32" }],
    name: "getPayment",
    outputs: [
      {
        components: [
          { name: "sender", type: "address" },
          { name: "recipientUsername", type: "string" },
          { name: "token", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "ephemeralPubKeyHash", type: "bytes32" },
          { name: "encryptedNote", type: "string" },
          { name: "claimed", type: "bool" },
          { name: "timestamp", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getSentPayments",
    outputs: [{ name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "username", type: "string" }],
    name: "getReceivedPayments",
    outputs: [{ name: "", type: "bytes32[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "registrationFee",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "username", type: "string" },
      { indexed: true, name: "owner", type: "address" },
    ],
    name: "UsernameRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "paymentId", type: "bytes32" },
      { indexed: true, name: "sender", type: "address" },
      { indexed: false, name: "recipientUsername", type: "string" },
      { indexed: false, name: "token", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "PaymentCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "paymentId", type: "bytes32" },
      { indexed: true, name: "claimer", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
    ],
    name: "PaymentClaimed",
    type: "event",
  },
] as const;

// ============ ERC20 ABI ============

export const ERC20_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ============ NEXUS FACTORY ABI ============

export const NEXUS_FACTORY_ABI = [
  {
    inputs: [],
    name: "getAllVaults",
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVaultCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "asset", type: "address" }],
    name: "getVaultForAsset",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "address" }],
    name: "assetToVault",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "", type: "uint256" }],
    name: "vaults",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ============ NEXUS PRIVACY POOL ABI ============

export const NEXUS_PRIVACY_POOL_ABI = [
  // Deposit
  {
    inputs: [
      { name: "_commitment", type: "bytes32" },
      { name: "_denominationIndex", type: "uint256" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Withdraw
  {
    inputs: [
      { name: "_nullifierHash", type: "bytes32" },
      { name: "_commitment", type: "bytes32" },
      { name: "_denominationIndex", type: "uint256" },
      { name: "_recipient", type: "address" },
      { name: "_relayer", type: "address" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // View Functions
  {
    inputs: [],
    name: "getDenominationCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "index", type: "uint256" }],
    name: "getDenomination",
    outputs: [
      { name: "amount", type: "uint256" },
      { name: "active", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllDenominations",
    outputs: [
      { name: "amounts", type: "uint256[]" },
      { name: "actives", type: "bool[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_denominationIndex", type: "uint256" }],
    name: "getAnonymitySetSize",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalAnonymitySet",
    outputs: [{ name: "total", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_nullifierHash", type: "bytes32" }],
    name: "isSpentNullifier",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_commitment", type: "bytes32" }],
    name: "isKnownCommitment",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPoolStats",
    outputs: [
      { name: "_totalDeposited", type: "uint256" },
      { name: "_totalWithdrawn", type: "uint256" },
      { name: "_currentBalance", type: "uint256" },
      { name: "_yieldEarned", type: "uint256" },
      { name: "_denominationCount", type: "uint256" },
      { name: "_createdAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_denominationIndex", type: "uint256" }],
    name: "getMerkleRoot",
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "token",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalDeposited",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalWithdrawn",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "commitment", type: "bytes32" },
      { indexed: true, name: "denominationIndex", type: "uint256" },
      { indexed: false, name: "leafIndex", type: "uint256" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "recipient", type: "address" },
      { indexed: true, name: "nullifierHash", type: "bytes32" },
      { indexed: false, name: "denominationIndex", type: "uint256" },
      { indexed: false, name: "relayer", type: "address" },
      { indexed: false, name: "fee", type: "uint256" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "Withdrawal",
    type: "event",
  },
] as const;
