import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { polygon } from "wagmi/chains";

// ============ CONTRACT ADDRESSES ============
// Deployed to Polygon Mainnet on 2026-02-27

export const CONTRACT_ADDRESSES = {
  STEALTH_REGISTRY:
    import.meta.env.VITE_STEALTH_REGISTRY_ADDRESS ||
    "0x7474DFdA6a63C0743eB06D5559AB161f4C30c22B",
  NEXUS_FACTORY:
    import.meta.env.VITE_NEXUS_FACTORY_ADDRESS ||
    "0x7e597aCDbA0Eb5bdb323Ea9e76272a736B5D3831",
  USDC_VAULT:
    import.meta.env.VITE_USDC_VAULT_ADDRESS ||
    "0x9cD3434916fF1B39b42c79d038fD7f622B22d695",
  USDT_VAULT:
    import.meta.env.VITE_USDT_VAULT_ADDRESS ||
    "0x8931b20fEC39E9b84e43A6bD8dcEa695b5272028",
  DAI_VAULT:
    import.meta.env.VITE_DAI_VAULT_ADDRESS ||
    "0xdF90cA5EF64Aa00e72E371f12D4c7594c9866B12",
  PRIVACY_POOL:
    import.meta.env.VITE_PRIVACY_POOL_ADDRESS ||
    "0x740a7a9191d5F8aB64C35C1e2Aa95A4FE4F57a5b",
} as const;

// Alias for easier imports
export const CONTRACTS = CONTRACT_ADDRESSES;

// ============ TOKEN ADDRESSES ============
// Native tokens on Polygon Mainnet

export const TOKEN_ADDRESSES = {
  USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
  USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
  WMATIC: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
} as const;

// ============ TOKEN METADATA ============

export const TOKENS = {
  USDC: {
    address: TOKEN_ADDRESSES.USDC,
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    icon: "💵",
    vault: CONTRACT_ADDRESSES.USDC_VAULT,
  },
  USDT: {
    address: TOKEN_ADDRESSES.USDT,
    symbol: "USDT",
    name: "Tether USD",
    decimals: 6,
    icon: "💲",
    vault: CONTRACT_ADDRESSES.USDT_VAULT,
  },
  DAI: {
    address: TOKEN_ADDRESSES.DAI,
    symbol: "DAI",
    name: "Dai Stablecoin",
    decimals: 18,
    icon: "🔶",
    vault: CONTRACT_ADDRESSES.DAI_VAULT,
  },
  MATIC: {
    address: TOKEN_ADDRESSES.WMATIC,
    symbol: "MATIC",
    name: "Polygon",
    decimals: 18,
    icon: "🟣",
    vault: null,
  },
} as const;

// ============ VAULT CONFIGURATION ============

export const VAULT_CONFIGS = {
  USDC: {
    address: CONTRACT_ADDRESSES.USDC_VAULT,
    name: "USDC Yield Vault",
    symbol: "USDC",
    description: "Low-risk USDC vault powered by Aave V3 on Polygon",
    tokenAddress: TOKEN_ADDRESSES.USDC,
    decimals: 6,
  },
  USDT: {
    address: CONTRACT_ADDRESSES.USDT_VAULT,
    name: "USDT Yield Vault",
    symbol: "USDT",
    description: "Low-risk USDT vault powered by Aave V3 on Polygon",
    tokenAddress: TOKEN_ADDRESSES.USDT,
    decimals: 6,
  },
  DAI: {
    address: CONTRACT_ADDRESSES.DAI_VAULT,
    name: "DAI Yield Vault",
    symbol: "DAI",
    description: "Low-risk DAI vault powered by Aave V3 on Polygon",
    tokenAddress: TOKEN_ADDRESSES.DAI,
    decimals: 18,
  },
} as const;

// ============ WAGMI CONFIG ============

const rpcUrl =
  import.meta.env.VITE_POLYGON_RPC_URL || "https://polygon-bor-rpc.publicnode.com";
const projectId =
  import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "nexus-protocol-polygon";

export const wagmiConfig = getDefaultConfig({
  appName: "NEXUS Protocol",
  projectId: projectId,
  chains: [polygon],
  transports: {
    [polygon.id]: http(rpcUrl),
  },
});

// ============ API ENDPOINTS ============

export const API_ENDPOINTS = {
  COINGECKO: "https://api.coingecko.com/api/v3",
  DEFILLAMA: "https://api.llama.fi",
  POLYGONSCAN: "https://api.polygonscan.com/api",
} as const;

// ============ AAVE V3 ADDRESSES ============

export const AAVE_ADDRESSES = {
  POOL: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
  USDC_ATOKEN: "0xA4D94019934D8333Ef880ABFFbF2FDd611C762BD",
  USDT_ATOKEN: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
  DAI_ATOKEN: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
} as const;

// ============ PRIVACY POOL CONFIG ============

export const PRIVACY_POOL_CONFIG = {
  address: CONTRACT_ADDRESSES.PRIVACY_POOL,
  token: TOKEN_ADDRESSES.USDC,
  tokenSymbol: "USDC",
  tokenDecimals: 6,
  denominations: [
    { amount: "100", label: "100 USDC", value: 100_000000n },
    { amount: "1000", label: "1,000 USDC", value: 1000_000000n },
    { amount: "10000", label: "10,000 USDC", value: 10000_000000n },
    { amount: "0.01", label: "0.01 USDC", value: 10000n },
    { amount: "0.1", label: "0.1 USDC", value: 100000n },
    { amount: "1", label: "1 USDC", value: 1000000n },
  ],
} as const;
