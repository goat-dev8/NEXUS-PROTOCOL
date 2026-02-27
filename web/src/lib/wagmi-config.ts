import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { polygon } from "wagmi/chains";

// WalletConnect Project ID - Replace with your own for production
const WALLETCONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "nexus-protocol-defi";

export const config = getDefaultConfig({
  appName: "NEXUS Protocol",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [polygon],
  transports: {
    [polygon.id]: http("https://polygon-rpc.com"),
  },
});

export { polygon };
