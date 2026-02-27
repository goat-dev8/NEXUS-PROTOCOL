import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { mockAIRecommendations } from "@/lib/mock-data";
import { Brain, Send, TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function AIAgent() {
  const [message, setMessage] = useState("");
  const [riskTolerance, setRiskTolerance] = useState([50]);
  const [autoCompound, setAutoCompound] = useState(true);

  const chatHistory = [
    { role: "user", content: "What should I do with my USDC?" },
    {
      role: "ai",
      content:
        "Based on current market conditions, I recommend depositing 60% into the USDC Vault (4.5% APY via Aave V3, low risk) and using the Privacy Pool for the remaining 40% to break on-chain correlation before withdrawing to a fresh address.",
    },
  ];

  const optimizationHistory = [
    { time: "2 hours ago", action: "Compounded USDC Vault rewards", reason: "Low gas, increased position by $45.67" },
    { time: "1 day ago", action: "Suggested rebalance to DAI Vault", reason: "Higher yield opportunity detected" },
    { time: "2 days ago", action: "Monitored Privacy Pool anonymity set", reason: "Set size reached 50, good withdrawal window" },
  ];

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
          <p className="text-white/40 text-sm">Online — Analyzing yield opportunities</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Strategy */}
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            Current Strategy
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/40 mb-0.5">Active Strategy</p>
              <p className="text-lg font-semibold text-white">Balanced Growth</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-white/40">Asset Allocation</p>
              {[
                { label: "Stablecoins", pct: 45, color: "bg-emerald-400" },
                { label: "Blue Chips", pct: 35, color: "bg-emerald-600" },
                { label: "High Yield", pct: 20, color: "bg-green-400" },
              ].map((item) => (
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Performance (7d)</span>
                <span className="text-emerald-400 font-semibold text-lg">+4.32%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Chat */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Chat with AI</h2>
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
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">AI Recommendations</h3>
            <div className="space-y-2">
              {mockAIRecommendations.map((rec, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-white/80 flex-1">{rec.title}</h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">{rec.apy}</span>
                  </div>
                  <p className="text-xs text-white/30 mb-2">{rec.reason}</p>
                  <button className="w-full py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors">Apply Suggestion</button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Optimization History */}
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          Optimization History
        </h2>
        <div className="space-y-3">
          {optimizationHistory.map((item, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-start justify-between mb-1">
                <p className="font-medium text-white text-sm">{item.action}</p>
                <span className="text-[10px] text-white/30">{item.time}</span>
              </div>
              <p className="text-xs text-white/40">{item.reason}</p>
            </motion.div>
          ))}
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
              <Label className="text-white/60 text-xs mb-2 block">Preferred Assets</Label>
              <div className="space-y-2">
                {["USDC", "USDT", "DAI", "MATIC"].map((asset) => (
                  <div key={asset} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded accent-emerald-500" />
                    <span className="text-sm text-white/60">{asset}</span>
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
