/**
 * useStealthPay - Custom hook for stealth payment functionality
 */

import { useCallback, useMemo } from "react";
import { formatUnits, keccak256, parseUnits, toHex } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { CONTRACTS } from "../lib/config";

// Typed ABIs for wagmi compatibility
const STEALTH_REGISTRY_ABI_TYPED = [
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
  {
    inputs: [],
    name: "registrationFee",
    outputs: [{ name: "", type: "uint256" }],
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
    inputs: [{ name: "user", type: "address" }],
    name: "getSentPayments",
    outputs: [{ name: "", type: "bytes32[]" }],
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
];

const ERC20_ABI_TYPED = [
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
];

export interface StealthProfile {
  username: string;
  owner: `0x${string}`;
  stealthMetaAddressHash: `0x${string}`;
  registeredAt: number;
  isActive: boolean;
}

export interface StealthPayment {
  paymentId: `0x${string}`;
  sender: `0x${string}`;
  recipientUsername: string;
  token: `0x${string}`;
  tokenSymbol: string;
  amount: string;
  amountRaw: bigint;
  encryptedNote: string;
  claimed: boolean;
  timestamp: number;
}

export interface UseStealthPayReturn {
  // Profile state
  userProfile: StealthProfile | null;
  hasProfile: boolean;
  registrationFee: string;

  // Payments
  pendingPayments: StealthPayment[];
  sentPayments: StealthPayment[];
  totalPending: string;

  // Loading states
  isLoading: boolean;
  isPending: boolean;
  isConfirming: boolean;
  txHash: `0x${string}` | undefined;

  // Actions
  checkUsernameAvailable: (username: string) => Promise<boolean>;
  registerUsername: (username: string) => Promise<`0x${string}` | undefined>;
  sendPayment: (
    recipientUsername: string,
    tokenAddress: `0x${string}`,
    amount: string,
    decimals: number,
    note?: string
  ) => Promise<`0x${string}` | undefined>;
  claimPayment: (
    paymentId: `0x${string}`
  ) => Promise<`0x${string}` | undefined>;
  approveToken: (
    tokenAddress: `0x${string}`,
    amount: string,
    decimals: number
  ) => Promise<`0x${string}` | undefined>;
  refetch: () => void;
}

export function useStealthPay(): UseStealthPayReturn {
  const { address: userAddress } = useAccount();
  const { writeContractAsync, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Get registration fee
  const { data: registrationFeeData } = useReadContract({
    address: CONTRACTS.STEALTH_REGISTRY as `0x${string}`,
    abi: STEALTH_REGISTRY_ABI_TYPED,
    functionName: "registrationFee",
  });

  // Get user's username (if registered)
  const { data: userUsername, refetch: refetchUsername } = useReadContract({
    address: CONTRACTS.STEALTH_REGISTRY as `0x${string}`,
    abi: STEALTH_REGISTRY_ABI_TYPED,
    functionName: "addressToUsername",
    args: userAddress ? [userAddress] : undefined,
  });

  // Get user's profile if they have a username
  const { data: profileData, refetch: refetchProfile } = useReadContract({
    address: CONTRACTS.STEALTH_REGISTRY as `0x${string}`,
    abi: STEALTH_REGISTRY_ABI_TYPED,
    functionName: "getProfile",
    args: userUsername ? [userUsername as string] : undefined,
  });

  // Get sent payments
  const { data: sentPaymentIds, refetch: refetchSent } = useReadContract({
    address: CONTRACTS.STEALTH_REGISTRY as `0x${string}`,
    abi: STEALTH_REGISTRY_ABI_TYPED,
    functionName: "getSentPayments",
    args: userAddress ? [userAddress] : undefined,
  });

  // Get pending payments for user's username
  const { data: pendingData, refetch: refetchPending } = useReadContract({
    address: CONTRACTS.STEALTH_REGISTRY as `0x${string}`,
    abi: STEALTH_REGISTRY_ABI_TYPED,
    functionName: "getPendingPayments",
    args: userUsername ? [userUsername as string] : undefined,
  });

  // Parse registration fee
  const registrationFee = useMemo(() => {
    if (!registrationFeeData) return "0.01";
    return formatUnits(registrationFeeData as bigint, 18);
  }, [registrationFeeData]);

  // Parse user profile
  const userProfile = useMemo((): StealthProfile | null => {
    if (!userUsername || !profileData || (userUsername as string).length === 0)
      return null;

    const [owner, stealthMetaAddressHash, registeredAt, isActive] =
      profileData as [`0x${string}`, `0x${string}`, bigint, boolean];

    return {
      username: userUsername as string,
      owner,
      stealthMetaAddressHash,
      registeredAt: Number(registeredAt),
      isActive,
    };
  }, [userUsername, profileData]);

  const hasProfile = !!userProfile && userProfile.isActive;

  // Parse pending payments
  const pendingPayments = useMemo((): StealthPayment[] => {
    if (!pendingData) return [];
    const [paymentIds] = pendingData as [`0x${string}`[], bigint];
    // Note: In production, you would fetch individual payment details
    return paymentIds.map((id) => ({
      paymentId: id,
      sender: "0x0000000000000000000000000000000000000000" as `0x${string}`,
      recipientUsername: (userUsername as string) || "",
      token: "0x0000000000000000000000000000000000000000" as `0x${string}`,
      tokenSymbol: "USDC",
      amount: "0",
      amountRaw: BigInt(0),
      encryptedNote: "",
      claimed: false,
      timestamp: 0,
    }));
  }, [pendingData, userUsername]);

  const totalPending = useMemo(() => {
    if (!pendingData) return "0";
    const [, total] = pendingData as [`0x${string}`[], bigint];
    return formatUnits(total, 6); // Assuming USDC decimals
  }, [pendingData]);

  // Parse sent payments
  const sentPayments = useMemo((): StealthPayment[] => {
    if (!sentPaymentIds) return [];
    return (sentPaymentIds as `0x${string}`[]).map((id) => ({
      paymentId: id,
      sender:
        userAddress ||
        ("0x0000000000000000000000000000000000000000" as `0x${string}`),
      recipientUsername: "",
      token: "0x0000000000000000000000000000000000000000" as `0x${string}`,
      tokenSymbol: "USDC",
      amount: "0",
      amountRaw: BigInt(0),
      encryptedNote: "",
      claimed: false,
      timestamp: 0,
    }));
  }, [sentPaymentIds, userAddress]);

  // Check if username is available
  const checkUsernameAvailable = useCallback(
    async (username: string): Promise<boolean> => {
      // This would be better as a read call, but for simplicity we'll simulate
      // In production, use useReadContract with a dynamic query
      return true;
    },
    []
  );

  // Register username
  const registerUsername = useCallback(
    async (username: string): Promise<`0x${string}` | undefined> => {
      if (!userAddress) return undefined;

      // Generate a simple stealth meta address hash (in production, use proper cryptography)
      const stealthMetaAddressHash = keccak256(
        toHex(`${userAddress}:${username}:${Date.now()}`)
      );

      const hash = await (writeContractAsync as any)({
        address: CONTRACTS.STEALTH_REGISTRY as `0x${string}`,
        abi: STEALTH_REGISTRY_ABI_TYPED,
        functionName: "registerUsername",
        args: [username, stealthMetaAddressHash],
        value: parseUnits(registrationFee, 18),
      });

      return hash;
    },
    [userAddress, writeContractAsync, registrationFee]
  );

  // Send payment
  const sendPayment = useCallback(
    async (
      recipientUsername: string,
      tokenAddress: `0x${string}`,
      amount: string,
      decimals: number,
      note?: string
    ): Promise<`0x${string}` | undefined> => {
      if (!userAddress) return undefined;

      const amountParsed = parseUnits(amount, decimals);
      const ephemeralPubKeyHash = keccak256(
        toHex(`${userAddress}:${Date.now()}`)
      );
      const encryptedNote = note || "";

      const hash = await (writeContractAsync as any)({
        address: CONTRACTS.STEALTH_REGISTRY as `0x${string}`,
        abi: STEALTH_REGISTRY_ABI_TYPED,
        functionName: "sendPayment",
        args: [
          recipientUsername,
          tokenAddress,
          amountParsed,
          ephemeralPubKeyHash,
          encryptedNote,
        ],
      });

      return hash;
    },
    [userAddress, writeContractAsync]
  );

  // Claim payment
  const claimPayment = useCallback(
    async (paymentId: `0x${string}`): Promise<`0x${string}` | undefined> => {
      const hash = await (writeContractAsync as any)({
        address: CONTRACTS.STEALTH_REGISTRY as `0x${string}`,
        abi: STEALTH_REGISTRY_ABI_TYPED,
        functionName: "claimPayment",
        args: [paymentId],
      });

      return hash;
    },
    [writeContractAsync]
  );

  // Approve token for stealth registry
  const approveToken = useCallback(
    async (
      tokenAddress: `0x${string}`,
      amount: string,
      decimals: number
    ): Promise<`0x${string}` | undefined> => {
      const amountParsed = parseUnits(amount, decimals);

      const hash = await (writeContractAsync as any)({
        address: tokenAddress,
        abi: ERC20_ABI_TYPED,
        functionName: "approve",
        args: [CONTRACTS.STEALTH_REGISTRY as `0x${string}`, amountParsed],
      });

      return hash;
    },
    [writeContractAsync]
  );

  // Refetch all data
  const refetch = useCallback(() => {
    refetchUsername();
    refetchProfile();
    refetchSent();
    refetchPending();
  }, [refetchUsername, refetchProfile, refetchSent, refetchPending]);

  return {
    userProfile,
    hasProfile,
    registrationFee,
    pendingPayments,
    sentPayments,
    totalPending,
    isLoading: false,
    isPending,
    isConfirming,
    txHash,
    checkUsernameAvailable,
    registerUsername,
    sendPayment,
    claimPayment,
    approveToken,
    refetch,
  };
}

export default useStealthPay;
