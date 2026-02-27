import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useVaults } from "@/hooks/useVaults";
import { formatUSD, usePrices } from "@/hooks/usePrices";
import { useWallet } from "@/hooks/useWallet";
import { Brain, Send, TrendingUp, Activity, Loader2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function AIAgent() {
  const [message, setMessage] = useState("");
  const [riskTolerance, setRiskTolerance] = useState([50]);
  const [autoCompound, setAutoCompound] = useState(true);
  const { isConnected } = useWallet();
  const { vaults, isLoading } = useVaults();
  const { prices } = usePrices();

  // Generate AI recommendations from real vault data
  const aiRecommendations = useMemo(() => {
    if (!vaults || vaults.length === 0) return [];
    return vaults
      .sort((a, b) => parseFloat(b.apy) - parseFloat(a.apy))
      .slice(0, 3)
      .map((vault) => ({
        title: `Deposit to ${vault.name}`,
        apy: `${vault.apy}% APY`,
        reason: `${vault.description}. TVL: $${parseFloat(vault.tvl).toLocaleString()}`,
        risk: vault.riskLevel === 1 ? "LOW" : vault.riskLevel === 2 ? "MEDIUM" : "HIGH",
      }));
  }, [vaults]);

  // Compute real strategy allocation from user positions
  const strategyAllocation = useMemo(() => {
    if (!vaults || vaults.length === 0) return [];
    let totalValue = 0;
    const positionValues: { label: string; value: number; color: string }[] = [];

    vaults.forEach((vault) => {
      const userAssets = parseFloat(vault.userAssets) || 0;
      if (userAssets > 0) {
        const tokenKey = vault.asset.symbol.toLowerCase() as keyof typeof prices;
        const price = prices[tokenKey] || 1;
        const value = userAssets * price;
        totalValue += value;
        positionValues.push({
          label: vault.asset.symbol,
          value,
          color:
            vault.asset.symbol === "USDC"
              ? "bg-emerald-400"
              : vault.asset.symbol === "USDT"
              ? "bg-emerald-600"
              : "bg-green-400",
        });
      }
    });

    if (totalValue === 0) {
      return [
        { label: "No positions", pct: 100, color: "bg-white/10" },
      ];
    }

    return positionValues.map((p) => ({
      label: p.label,
      pct: Math.round((p.value / totalValue) * 100),
      color: p.color,
    }));
  }, [vaults, prices]);

  // Generate contextual chat based on real data
  const chatHistory = useMemo(() => {
    if (!vaults || vaults.length === 0) {
      return [
        { role: "ai" as const, content: "Welcome to Nexus AI. Connect your wallet and deposit to a vault — I'll analyze your positions and suggest optimizations based on real on-chain data." },
      ];
    }

    const hasPositions = vaults.some((v) => parseFloat(v.userAssets) > 0);
    const bestVault = [...vaults].sort((a, b) => parseFloat(b.apy) - parseFloat(a.apy))[0];

    if (!hasPositions) {
      return [
        {
          role: "ai" as const,
          content: `I can see ${vaults.length} vaults available. The highest-yielding vault is ${bestVault.name} at ${bestVault.apy}% APY. Consider depositing into a vault to start earning yield from Aave V3 on Polygon.`,
        },
      ];
    }

    const activeVaults = vaults.filter((v) => parseFloat(v.userAssets) > 0);
    return [
      {
        role: "ai" as const,
        content: `You have active positions in ${activeVaults.length} vault${activeVaults.length > 1 ? "s" : ""}. ${activeVaults.map((v) => `${v.asset.symbol}: ${parseFloat(v.userAssets).toLocaleString()} tokens at ${v.apy}% APY`).join(". ")}. I'm monitoring Aave V3 rates in real time.`,
      },
    ];
  }, [vaults]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Brain className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-white">AI Yield Agent</h1>
          <p className="text-white/40 text-sm mb-6">Connect your wallet to access AI-powered yield optimization</p>
          <ConnectButton />
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Brain className="h-6 w-6 text-emerald-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">AI Yield Agent</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <p className="text-white/40 text-sm">Online — Analyzing {vaults.length} vaults on Polygon</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Strategy */}
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            Current Allocation
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs text-white/40">Your Vault Positions</p>
              {strategyAllocation.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">{item.label}</span>
                    <span className="font-medium text-white">{item.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/5">
              <div className="flex items-start gap-2 text-xs text-white/30">
                <Shield className="h-3 w-3 mt-0.5 text-emerald-400/50" />
                <span>All vaults use Aave V3 on Polygon for yield generation</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">AI Analysis</h2>
          <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
            {chatHistory.map((msg, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-xl ${msg.role === "user" ? "bg-emerald-600 text-white" : "bg-white/[0.04] border border-white/5"}`}>
                  {msg.role === "ai" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-emerald-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Nexus AI</span>
                    </div>
                  )}
                  <p className="text-sm text-white/80">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Ask AI for yield advice..." value={message} onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && setMessage("")}
              className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/30" />
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Recommendations</h3>
            <div className="space-y-2">
              {aiRecommendations.length === 0 ? (
                <p className="text-sm text-white/20 py-4 text-center">Loading vault data...</p>
              ) : (
                aiRecommendations.map((rec, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-medium text-white/80 flex-1">{rec.title}</h4>
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">{rec.apy}</span>
                    </div>
                    <p className="text-xs text-white/30 mb-2">{rec.reason}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        rec.risk === "LOW"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : rec.risk === "MEDIUM"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>{rec.risk} Risk</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Settings */}
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Strategy Settings</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="text-white/60 text-xs mb-3 block">Risk Tolerance</Label>
              <Slider value={riskTolerance} onValueChange={setRiskTolerance} max={100} step={1} className="mb-2" />
              <div className="flex justify-between text-[10px] text-white/30">
                <span>Conservative</span>
                <span className="font-medium text-white/60">{riskTolerance}%</span>
                <span>Aggressive</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white/60 text-xs">Auto-Compound Rewards</Label>
                <p className="text-[10px] text-white/30">Automatically reinvest earnings</p>
              </div>
              <Switch checked={autoCompound} onCheckedChange={setAutoCompound} />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-white/60 text-xs mb-2 block">Available Vaults</Label>
              <div className="space-y-2">
                {vaults.map((vault) => (
                  <div key={vault.address} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                    <span className="text-sm text-white/60">{vault.asset.symbol} — {vault.apy}% APY</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button className="w-full mt-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
