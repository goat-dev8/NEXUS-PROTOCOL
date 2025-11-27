import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { mockPortfolio, mockTransactions, mockAIRecommendations } from "@/lib/mock-data";
import { TRANSACTION_STATUS } from "@/lib/constants";
import { Wallet, TrendingUp, Activity, DollarSign, ArrowUpRight, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/useAppStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const { username } = useAppStore();

  const quickActions = [
    { label: "Deposit", action: () => navigate("/app/vaults") },
    { label: "Withdraw", action: () => {} },
    { label: "Claim Rewards", action: () => {} },
    { label: "Send Stealth", action: () => navigate("/app/stealth") },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, <span className="gradient-text">{username}</span>
        </h1>
        <p className="text-muted-foreground">Here's your portfolio overview</p>
      </motion.div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Balance"
          value={`$${mockPortfolio.totalBalance.toLocaleString()}`}
          icon={<Wallet className="h-5 w-5" />}
          trend={mockPortfolio.change24h}
        />
        <StatCard
          label="24h Change"
          value={`+${mockPortfolio.change24h}%`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Active Positions"
          value={mockPortfolio.activePositions}
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Rewards"
          value={`$${mockPortfolio.pendingRewards}`}
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Quick Actions */}
      <GlassCard>
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={action.action}
              className="p-4 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors border border-border/50"
            >
              <span className="font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Positions */}
        <div className="lg:col-span-2">
          <GlassCard>
            <h2 className="text-xl font-bold mb-4">Active Positions</h2>
            <div className="space-y-3">
              {mockPortfolio.positions.map((position, index) => (
                <motion.div
                  key={position.vault}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-secondary/50 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{position.vault}</h3>
                    <BadgeCustom variant="success">{position.status}</BadgeCustom>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Deposited</p>
                      <p className="font-medium">${position.deposited.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current Value</p>
                      <p className="font-medium text-success">${position.currentValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">APY</p>
                      <p className="font-medium text-primary">{position.apy}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">P&L</p>
                      <p className="font-medium text-success">
                        +${(position.currentValue - position.deposited).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* AI Recommendations */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">NEXUS AI Suggests</h2>
          </div>
          <div className="space-y-3">
            {mockAIRecommendations.map((rec, index) => (
              <motion.div
                key={rec.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-secondary/50 rounded-lg border border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium flex-1">{rec.title}</h4>
                  <span className="text-success text-sm font-bold">{rec.apy}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{rec.reason}</p>
                <BadgeCustom variant={rec.risk === "LOW" ? "success" : "warning"}>
                  {rec.risk} Risk
                </BadgeCustom>
              </motion.div>
            ))}
          </div>
          <GradientButton className="w-full mt-4" onClick={() => navigate("/app/ai")}>
            View AI Dashboard
          </GradientButton>
        </GlassCard>
      </div>

      {/* Recent Transactions */}
      <GlassCard>
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Vault</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Tx</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.slice(0, 5).map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/30 hover:bg-secondary/30"
                >
                  <td className="py-3 px-2 text-sm">{tx.type}</td>
                  <td className="py-3 px-2 text-sm">{tx.vault}</td>
                  <td className="py-3 px-2 text-sm font-medium">
                    {tx.amount} {tx.asset}
                  </td>
                  <td className="py-3 px-2">
                    <BadgeCustom variant={
                      tx.status === "COMPLETED" ? "success" : 
                      tx.status === "PENDING" ? "warning" : "danger"
                    }>
                      {TRANSACTION_STATUS[tx.status].label}
                    </BadgeCustom>
                  </td>
                  <td className="py-3 px-2">
                    <a 
                      href="#" 
                      className="text-primary text-sm flex items-center gap-1 hover:underline"
                    >
                      {tx.txHash}
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
