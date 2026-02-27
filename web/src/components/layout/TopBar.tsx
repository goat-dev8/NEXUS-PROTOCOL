import { useAppStore } from "@/stores/useAppStore";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { Menu, Shield, Wallet } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

export const TopBar = () => {
  const { toggleSidebar } = useAppStore();
  const { address, isConnected } = useAccount();

  // Sync wagmi state with app store
  useEffect(() => {
    if (isConnected && address) {
      useAppStore.setState({
        walletConnected: true,
        walletAddress: `${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } else {
      useAppStore.setState({
        walletConnected: false,
        walletAddress: null,
      });
    }
  }, [isConnected, address]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl"
    >
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5 text-white/70" />
          </button>
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Shield className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-base hidden md:block text-white">
              Nexus
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openConnectModal,
              openAccountModal,
              mounted,
            }) => {
              const ready = mounted;
              const connected = ready && account && chain;

              return (
                <div
                  {...(!ready && {
                    "aria-hidden": true,
                    style: {
                      opacity: 0,
                      pointerEvents: "none" as const,
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors"
                        >
                          <Wallet className="h-4 w-4" />
                          Connect
                        </button>
                      );
                    }

                    return (
                      <button
                        onClick={openAccountModal}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full hover:border-emerald-500/30 transition-colors"
                      >
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-sm font-medium hidden md:block text-white/80">
                          {account.displayName}
                        </span>
                        <Wallet className="h-4 w-4 text-white/50" />
                      </button>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </div>
    </motion.header>
  );
};
