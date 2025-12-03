/**
 * useWallet - Custom hook for wallet connection and state
 */

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useMemo } from "react";
import {
  useAccount,
  useBalance,
  useChainId,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { polygon } from "wagmi/chains";

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: `0x${string}` | undefined;
  shortAddress: string;
  chainId: number | undefined;
  isCorrectChain: boolean;
  maticBalance: string;
  maticBalanceRaw: bigint;
}

export interface WalletActions {
  connect: () => void;
  disconnect: () => void;
  switchToPolygon: () => void;
}

export function useWallet(): WalletState & WalletActions {
  const { address, isConnected, isConnecting } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();

  const { data: maticBalanceData } = useBalance({
    address: address,
    chainId: polygon.id,
  });

  const shortAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const isCorrectChain = chainId === polygon.id;

  const maticBalance = useMemo(() => {
    if (!maticBalanceData) return "0";
    // Format balance from bigint value and decimals
    const value =
      Number(maticBalanceData.value) / Math.pow(10, maticBalanceData.decimals);
    return value.toFixed(4);
  }, [maticBalanceData]);

  const maticBalanceRaw = maticBalanceData?.value ?? BigInt(0);

  const connect = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  const switchToPolygon = () => {
    if (switchChain) {
      switchChain({ chainId: polygon.id });
    }
  };

  return {
    isConnected,
    isConnecting,
    address,
    shortAddress,
    chainId,
    isCorrectChain,
    maticBalance,
    maticBalanceRaw,
    connect,
    disconnect,
    switchToPolygon,
  };
}

export default useWallet;
