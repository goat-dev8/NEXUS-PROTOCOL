import { useState, useCallback, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { createPublicClient, http, formatUnits, parseUnits, keccak256, encodePacked, toHex } from "viem";
import { polygon } from "viem/chains";
import { CONTRACT_ADDRESSES, PRIVACY_POOL_CONFIG } from "@/lib/config";
import { NEXUS_PRIVACY_POOL_ABI, ERC20_ABI } from "@/lib/contracts/abis";

const publicClient = createPublicClient({
  chain: polygon,
  transport: http("https://polygon-bor-rpc.publicnode.com"),
});

export interface PoolStats {
  totalDeposited: string;
  totalWithdrawn: string;
  currentBalance: string;
  yieldEarned: string;
  denominationCount: number;
  createdAt: number;
}

export interface DenominationInfo {
  index: number;
  amount: string;
  amountFormatted: string;
  active: boolean;
  anonymitySetSize: number;
}

export interface PrivacyNote {
  secret: string;
  nullifier: string;
  commitment: string;
  denominationIndex: number;
  amount: string;
  noteString: string;
}

/**
 * Generate a random 32-byte hex string
 */
function randomBytes32(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}

/**
 * Generate a commitment and privacy note
 */
export function generateCommitment(denominationIndex: number, amount: string): PrivacyNote {
  const secret = randomBytes32();
  const nullifier = randomBytes32();

  const commitment = keccak256(
    encodePacked(["bytes32", "bytes32"], [secret as `0x${string}`, nullifier as `0x${string}`])
  );

  // Encode the note as a single string the user must save
  const noteData = {
    v: 1, // version
    s: secret,
    n: nullifier,
    c: commitment,
    d: denominationIndex,
    a: amount,
  };

  const noteString = `nexus-privacy-v1-${btoa(JSON.stringify(noteData))}`;

  return {
    secret,
    nullifier,
    commitment,
    denominationIndex,
    amount,
    noteString,
  };
}

/**
 * Parse a privacy note string back into its components
 */
export function parseNote(noteString: string): PrivacyNote | null {
  try {
    if (!noteString.startsWith("nexus-privacy-v1-")) return null;
    const encoded = noteString.slice("nexus-privacy-v1-".length);
    const data = JSON.parse(atob(encoded));
    return {
      secret: data.s,
      nullifier: data.n,
      commitment: data.c,
      denominationIndex: data.d,
      amount: data.a,
      noteString,
    };
  } catch {
    return null;
  }
}

export function usePrivacyPool() {
  const { address } = useAccount();
  const [poolStats, setPoolStats] = useState<PoolStats | null>(null);
  const [denominations, setDenominations] = useState<DenominationInfo[]>([]);
  const [userBalance, setUserBalance] = useState<string>("0");
  const [userAllowance, setUserAllowance] = useState<bigint>(0n);
  const [isLoading, setIsLoading] = useState(true);

  const { writeContractAsync, isPending } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const poolAddress = CONTRACT_ADDRESSES.PRIVACY_POOL as `0x${string}`;
  const tokenAddress = PRIVACY_POOL_CONFIG.token as `0x${string}`;

  // Fetch pool data
  const fetchPoolData = useCallback(async () => {
    if (poolAddress === "0x0000000000000000000000000000000000000000") {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch pool stats
      const stats = await publicClient.readContract({
        address: poolAddress,
        abi: NEXUS_PRIVACY_POOL_ABI,
        functionName: "getPoolStats",
      }) as [bigint, bigint, bigint, bigint, bigint, bigint];

      setPoolStats({
        totalDeposited: formatUnits(stats[0], 6),
        totalWithdrawn: formatUnits(stats[1], 6),
        currentBalance: formatUnits(stats[2], 6),
        yieldEarned: formatUnits(stats[3], 6),
        denominationCount: Number(stats[4]),
        createdAt: Number(stats[5]),
      });

      // Fetch denominations
      const denoms = await publicClient.readContract({
        address: poolAddress,
        abi: NEXUS_PRIVACY_POOL_ABI,
        functionName: "getAllDenominations",
      }) as [bigint[], boolean[]];

      const denomInfos: DenominationInfo[] = [];
      for (let i = 0; i < denoms[0].length; i++) {
        const anonSet = await publicClient.readContract({
          address: poolAddress,
          abi: NEXUS_PRIVACY_POOL_ABI,
          functionName: "getAnonymitySetSize",
          args: [BigInt(i)],
        }) as bigint;

        denomInfos.push({
          index: i,
          amount: denoms[0][i].toString(),
          amountFormatted: formatUnits(denoms[0][i], 6),
          active: denoms[1][i],
          anonymitySetSize: Number(anonSet),
        });
      }
      setDenominations(denomInfos);

      // Fetch user balance and allowance
      if (address) {
        const bal = await publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "balanceOf",
          args: [address],
        }) as bigint;
        setUserBalance(formatUnits(bal, 6));

        const allow = await publicClient.readContract({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: "allowance",
          args: [address, poolAddress],
        }) as bigint;
        setUserAllowance(allow);
      }
    } catch (error) {
      console.error("Error fetching privacy pool data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [address, poolAddress, tokenAddress]);

  useEffect(() => {
    fetchPoolData();
  }, [fetchPoolData]);

  // Approve token
  const approveToken = useCallback(
    async (amount: bigint) => {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [poolAddress, amount],
      });
      setTxHash(hash);
      return hash;
    },
    [writeContractAsync, tokenAddress, poolAddress]
  );

  // Deposit into privacy pool
  const deposit = useCallback(
    async (commitment: string, denominationIndex: number) => {
      const hash = await writeContractAsync({
        address: poolAddress,
        abi: NEXUS_PRIVACY_POOL_ABI,
        functionName: "deposit",
        args: [commitment as `0x${string}`, BigInt(denominationIndex)],
      });
      setTxHash(hash);
      return hash;
    },
    [writeContractAsync, poolAddress]
  );

  // Withdraw from privacy pool
  const withdraw = useCallback(
    async (note: PrivacyNote, recipientAddress: string) => {
      const nullifierHash = keccak256(note.nullifier as `0x${string}`);

      const hash = await writeContractAsync({
        address: poolAddress,
        abi: NEXUS_PRIVACY_POOL_ABI,
        functionName: "withdraw",
        args: [
          nullifierHash,
          note.commitment as `0x${string}`,
          BigInt(note.denominationIndex),
          recipientAddress as `0x${string}`,
          "0x0000000000000000000000000000000000000000" as `0x${string}`, // no relayer
        ],
      });
      setTxHash(hash);
      return hash;
    },
    [writeContractAsync, poolAddress]
  );

  return {
    poolStats,
    denominations,
    userBalance,
    userAllowance,
    isLoading,
    isPending,
    isConfirming,
    txHash,
    approveToken,
    deposit,
    withdraw,
    refetch: fetchPoolData,
    generateCommitment,
    parseNote,
  };
}
