import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { config } from "./lib/wagmi-config";
import AIAgent from "./pages/AIAgent";
import AppLayout from "./pages/AppLayout";
import Dashboard from "./pages/Dashboard";
import Governance from "./pages/Governance";
import Identity from "./pages/Identity";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Portfolio from "./pages/Portfolio";
import Settings from "./pages/Settings";
import StealthPay from "./pages/StealthPay";
import Vaults from "./pages/Vaults";

const queryClient = new QueryClient();

// Custom RainbowKit theme to match NEXUS Protocol design
const nexusTheme = darkTheme({
  accentColor: "#8B5CF6", // Purple accent
  accentColorForeground: "white",
  borderRadius: "medium",
  fontStack: "system",
  overlayBlur: "small",
});

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider theme={nexusTheme} modalSize="compact">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="vaults" element={<Vaults />} />
                <Route path="stealth" element={<StealthPay />} />
                <Route path="ai" element={<AIAgent />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="governance" element={<Governance />} />
                <Route path="identity" element={<Identity />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
