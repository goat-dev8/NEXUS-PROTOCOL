import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { BadgeCustom } from "@/components/ui/badge-custom";
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
      content: "Based on current market conditions, I recommend depositing 60% into the USDC Fortress vault (12.5% APY, low risk) and 40% into High Yield Alpha (28.9% APY, higher risk but diversified). This balances stability with growth potential." 
    },
  ];

  const optimizationHistory = [
    { 
      time: "2 hours ago",
      action: "Moved $2,500 from ETH Shield to High Yield Alpha",
      reason: "+3.2% better APY, acceptable risk increase"
    },
    {
      time: "1 day ago",
      action: "Compounded rewards in USDC Fortress",
      reason: "Optimal gas prices, increased position by $45.67"
    },
    {
      time: "2 days ago",
      action: "Rebalanced MATIC Guardian position",
      reason: "Reduced exposure by 10% after yield spike normalized"
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-8 w-8 text-primary animate-pulse" />
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">NEXUS AI Agent</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <p className="text-muted-foreground">Online - Optimizing Your Portfolio</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Strategy */}
        <GlassCard>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Current Strategy
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Active Strategy</p>
              <p className="text-lg font-semibold">Balanced Growth</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Asset Allocation</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Stablecoins</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: "45%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Blue Chips</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "35%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>High Yield</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: "20%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Performance (7d)</span>
                <span className="text-success font-semibold text-lg">+4.32%</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* AI Chat Interface */}
        <GlassCard className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Chat with AI</h2>
          
          <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
            {chatHistory.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {msg.role === "ai" && (
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <span className="text-xs font-semibold text-primary">NEXUS AI</span>
                    </div>
                  )}
                  <p className="text-sm">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Ask AI for advice..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && setMessage("")}
            />
            <GradientButton size="sm">
              <Send className="h-4 w-4" />
            </GradientButton>
          </div>

          <div className="mt-6 pt-6 border-t border-border/50">
            <h3 className="font-semibold mb-3">AI Recommendations</h3>
            <div className="space-y-2">
              {mockAIRecommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-secondary/50 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium flex-1">{rec.title}</h4>
                    <BadgeCustom variant="success">{rec.apy}</BadgeCustom>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{rec.reason}</p>
                  <GradientButton size="sm" className="w-full">
                    Apply Suggestion
                  </GradientButton>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Optimization History */}
      <GlassCard>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Optimization History
        </h2>
        <div className="space-y-3">
          {optimizationHistory.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-secondary/50 rounded-lg border border-border/50"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium">{item.action}</p>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
              <p className="text-sm text-muted-foreground">{item.reason}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>

      {/* Strategy Settings */}
      <GlassCard>
        <h2 className="text-xl font-bold mb-4">Strategy Settings</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Risk Tolerance</Label>
              <Slider
                value={riskTolerance}
                onValueChange={setRiskTolerance}
                max={100}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span className="font-medium text-foreground">{riskTolerance}%</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Compound Rewards</Label>
                <p className="text-xs text-muted-foreground">Automatically reinvest earnings</p>
              </div>
              <Switch checked={autoCompound} onCheckedChange={setAutoCompound} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Preferred Assets</Label>
              <div className="space-y-2">
                {["USDC", "USDT", "ETH", "MATIC", "WBTC"].map((asset) => (
                  <div key={asset} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">{asset}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <GradientButton className="w-full mt-6">
          Save Preferences
        </GradientButton>
      </GlassCard>
    </div>
  );
}
