/**
 * useVaults - Custom hook for interacting with NEXUS Vaults
 * Simplified version that avoids wagmi v2 type complexity
 */

import { useCallback, useEffect, useState } from "react";
import { createPublicClient, formatUnits, http, parseUnits } from "viem";
import { polygon } from "viem/chains";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { TOKENS, VAULT_CONFIGS } from "../lib/config";

// Create a direct viem client to avoid wagmi type issues
const publicClient = createPublicClient({
  chain: polygon,
  transport: http("https://polygon-rpc.com"),
});

// Helper function to bypass strict type checking
const readContract = async (params: any): Promise<any> => {
  return publicClient.readContract(params as any);
};

// Simple ABIs without const assertion to avoid type inference issues
const ERC20_ABI = [
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
];

const NEXUS_VAULT_ABI = [
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
      { name: "shares", type: "uint256" },
      { name: "receiver", type: "address" },
      { name: "owner", type: "address" },
    ],
    name: "redeem",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
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
];

export interface VaultInfo {
  address: `0x${string}`;
  name: string;
  symbol: string;
  description: string;
  asset: {
    address: `0x${string}`;
    symbol: string;
    decimals: number;
    icon: string;
  };
  tvl: string;
  tvlRaw: bigint;
  apy: string;
  riskLevel: number;
  userShares: string;
  userSharesRaw: bigint;
  userAssets: string;
  userAssetsRaw: bigint;
  userBalance: string;
  userBalanceRaw: bigint;
  userAllowance: bigint;
  depositFee: number;
  withdrawFee: number;
}

export interface UseVaultsReturn {
  vaults: VaultInfo[];
  isLoading: boolean;
  refetch: () => void;
  deposit: (
    vaultAddress: `0x${string}`,
    amount: string,
    decimals: number
  ) => Promise<`0x${string}` | undefined>;
  withdraw: (
    vaultAddress: `0x${string}`,
    shares: string
  ) => Promise<`0x${string}` | undefined>;
  approve: (
    tokenAddress: `0x${string}`,
    spenderAddress: `0x${string}`,
    amount: string,
    decimals: number
  ) => Promise<`0x${string}` | undefined>;
  isPending: boolean;
  isConfirming: boolean;
  txHash: `0x${string}` | undefined;
}

export function useVaults(): UseVaultsReturn {
  const { address: userAddress } = useAccount();
  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const [vaults, setVaults] = useState<VaultInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch vault data using direct viem client
  const fetchVaultData = useCallback(async () => {
    setIsLoading(true);

    try {
      const vaultEntries = Object.entries(VAULT_CONFIGS);
      const vaultInfos: VaultInfo[] = [];

      for (const [, vault] of vaultEntries) {
        const tokenInfo = TOKENS[vault.symbol as keyof typeof TOKENS];

        // Read vault totalAssets
        let totalAssets = BigInt(0);
        try {
          totalAssets = (await readContract({
            address: vault.address as `0x${string}`,
            abi: NEXUS_VAULT_ABI,
            functionName: "totalAssets",
          })) as bigint;
        } catch {
          // Use default
        }

        // User-specific data
        let userSharesRaw = BigInt(0);
        let userBalanceRaw = BigInt(0);
        let userAllowance = BigInt(0);
        let shareToAssetRatio = BigInt(1e18);

        if (userAddress) {
          try {
            userSharesRaw = (await readContract({
              address: vault.address as `0x${string}`,
              abi: NEXUS_VAULT_ABI,
              functionName: "balanceOf",
              args: [userAddress],
            })) as bigint;
          } catch {
            // Use default
          }

          try {
            shareToAssetRatio = (await readContract({
              address: vault.address as `0x${string}`,
              abi: NEXUS_VAULT_ABI,
              functionName: "convertToAssets",
              args: [BigInt(1e18)],
            })) as bigint;
          } catch {
            // Use default
          }

          try {
            userBalanceRaw = (await readContract({
              address: tokenInfo.address as `0x${string}`,
              abi: ERC20_ABI,
              functionName: "balanceOf",
              args: [userAddress],
            })) as bigint;
          } catch {
            // Use default
          }

          try {
            userAllowance = (await readContract({
              address: tokenInfo.address as `0x${string}`,
              abi: ERC20_ABI,
              functionName: "allowance",
              args: [userAddress, vault.address as `0x${string}`],
            })) as bigint;
          } catch {
            // Use default
          }
        }

        const userAssetsRaw =
          userSharesRaw > 0
            ? (userSharesRaw * shareToAssetRatio) / BigInt(1e18)
            : BigInt(0);

        vaultInfos.push({
          address: vault.address as `0x${string}`,
          name: vault.name,
          symbol: vault.symbol,
          description: vault.description,
          asset: {
            address: tokenInfo.address as `0x${string}`,
            symbol: tokenInfo.symbol,
            decimals: tokenInfo.decimals,
            icon: tokenInfo.icon,
          },
          tvl: formatUnits(totalAssets, tokenInfo.decimals),
          tvlRaw: totalAssets,
          apy: "5.00", // Default APY
          riskLevel: 1,
          userShares: formatUnits(userSharesRaw, 18),
          userSharesRaw,
          userAssets: formatUnits(userAssetsRaw, tokenInfo.decimals),
          userAssetsRaw,
          userBalance: formatUnits(userBalanceRaw, tokenInfo.decimals),
          userBalanceRaw,
          userAllowance,
          depositFee: 0.1,
          withdrawFee: 0.1,
        });
      }

      setVaults(vaultInfos);
    } catch (err) {
      console.error("Error fetching vault data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  // Initial fetch and refetch on user change
  useEffect(() => {
    fetchVaultData();
  }, [fetchVaultData]);

  const refetch = useCallback(() => {
    fetchVaultData();
  }, [fetchVaultData]);

  // Deposit function
  const deposit = useCallback(
    async (
      vaultAddress: `0x${string}`,
      amount: string,
      decimals: number
    ): Promise<`0x${string}` | undefined> => {
      if (!userAddress) return undefined;

      const amountParsed = parseUnits(amount, decimals);

      const hash = await (writeContractAsync as any)({
        address: vaultAddress,
        abi: NEXUS_VAULT_ABI,
        functionName: "deposit",
        args: [amountParsed, userAddress],
      });

      return hash;
    },
    [userAddress, writeContractAsync]
  );

  // Withdraw function (by shares)
  const withdraw = useCallback(
    async (
      vaultAddress: `0x${string}`,
      shares: string
    ): Promise<`0x${string}` | undefined> => {
      if (!userAddress) return undefined;

      const sharesParsed = parseUnits(shares, 18);

      const hash = await (writeContractAsync as any)({
        address: vaultAddress,
        abi: NEXUS_VAULT_ABI,
        functionName: "redeem",
        args: [sharesParsed, userAddress, userAddress],
      });

      return hash;
    },
    [userAddress, writeContractAsync]
  );

  // Approve function
  const approve = useCallback(
    async (
      tokenAddress: `0x${string}`,
      spenderAddress: `0x${string}`,
      amount: string,
      decimals: number
    ): Promise<`0x${string}` | undefined> => {
      const amountParsed = parseUnits(amount, decimals);

      const hash = await (writeContractAsync as any)({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [spenderAddress, amountParsed],
      });

      return hash;
    },
    [writeContractAsync]
  );

  return {
    vaults,
    isLoading,
    refetch,
    deposit,
    withdraw,
    approve,
    isPending,
    isConfirming,
    txHash,
  };
}

export default useVaults;
