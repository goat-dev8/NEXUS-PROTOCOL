import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { polygon } from "wagmi/chains";

// ============ CONTRACT ADDRESSES ============
// Deployed to Polygon Mainnet on 2025-12-03

export const CONTRACT_ADDRESSES = {
  STEALTH_REGISTRY:
    import.meta.env.VITE_STEALTH_REGISTRY_ADDRESS ||
    "0x678e033Ac388BfE5a1b0a98329e98E253854060C",
  NEXUS_FACTORY:
    import.meta.env.VITE_NEXUS_FACTORY_ADDRESS ||
    "0x548eBA09dD9FE4D45F76Cf6a6E42139c16a6A387",
  USDC_VAULT:
    import.meta.env.VITE_USDC_VAULT_ADDRESS ||
    "0x3AA9fb8b22466403f6a3498c99ACDb9A27e80a49",
  USDT_VAULT:
    import.meta.env.VITE_USDT_VAULT_ADDRESS ||
    "0x579d7019DbCD1598Ef4757723Baa05c7c31249F4",
  DAI_VAULT:
    import.meta.env.VITE_DAI_VAULT_ADDRESS ||
    "0xfB758bAD4Ee1533E79e3130665178a151D7ad00a",
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
  import.meta.env.VITE_POLYGON_RPC_URL || "https://polygon-rpc.com";
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
  USDC_ATOKEN: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
  USDT_ATOKEN: "0x6ab707Aca953eDAeFBc4fD23bA73294241490620",
  DAI_ATOKEN: "0x82E64f49Ed5EC1bC6e43DAD4FC8Af9bb3A2312EE",
} as const;
