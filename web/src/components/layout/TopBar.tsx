import { GradientButton } from "@/components/ui/gradient-button";
import { useAppStore } from "@/stores/useAppStore";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { Menu, Wallet } from "lucide-react";
import { useEffect } from "react";
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
      className="sticky top-0 z-40 w-full border-b border-border/50 glass"
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold">N</span>
            </div>
            <span className="font-bold text-lg hidden md:block gradient-text">
              NEXUS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
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
                      pointerEvents: "none",
                      userSelect: "none",
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <GradientButton size="sm" onClick={openConnectModal}>
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect Wallet
                        </GradientButton>
                      );
                    }

                    return (
                      <button
                        onClick={openAccountModal}
                        className="flex items-center gap-2 glass px-4 py-2 rounded-lg hover:border-primary/30 transition-colors"
                      >
                        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                        <span className="text-sm font-medium hidden md:block">
                          {account.displayName}
                        </span>
                        <Wallet className="h-4 w-4" />
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
