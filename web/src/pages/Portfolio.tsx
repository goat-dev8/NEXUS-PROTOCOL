import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat-card";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { mockPortfolio } from "@/lib/mock-data";
import { Wallet, TrendingUp, Activity, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function Portfolio() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="gradient-text">Portfolio</span>
        </h1>
        <p className="text-muted-foreground">Your complete portfolio overview</p>
      </motion.div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Value"
          value={`$${mockPortfolio.totalBalance.toLocaleString()}`}
          icon={<Wallet className="h-5 w-5" />}
          trend={mockPortfolio.change24h}
        />
        <StatCard
          label="24h Change"
          value={`+$${(mockPortfolio.totalBalance * mockPortfolio.change24h / 100).toFixed(2)}`}
          icon={<TrendingUp className="h-5 w-5" />}
          trend={mockPortfolio.change24h}
        />
        <StatCard
          label="Active Positions"
          value={mockPortfolio.activePositions}
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          label="Total Earned"
          value={`$${mockPortfolio.pendingRewards}`}
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Portfolio Value Chart Placeholder */}
      <GlassCard>
        <h2 className="text-xl font-bold mb-4">Portfolio Value</h2>
        <div className="flex gap-2 mb-4">
          {["24H", "7D", "30D", "90D", "1Y", "ALL"].map((period) => (
            <button
              key={period}
              className="px-3 py-1 rounded-lg text-sm font-medium bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {period}
            </button>
          ))}
        </div>
        <div className="h-64 bg-secondary/30 rounded-lg flex items-center justify-center border border-border/50">
          <p className="text-muted-foreground">Chart visualization would go here</p>
        </div>
      </GlassCard>

      {/* Asset Allocation */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h2 className="text-xl font-bold mb-4">Asset Allocation</h2>
          <div className="flex items-center justify-center mb-6">
            <div className="w-48 h-48 rounded-full bg-secondary/30 flex items-center justify-center border border-border/50">
              <p className="text-muted-foreground">Donut chart visualization</p>
            </div>
          </div>
          <div className="space-y-3">
            {mockPortfolio.positions.map((position, index) => {
              const percentage = ((position.currentValue / mockPortfolio.totalBalance) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? "bg-primary" : index === 1 ? "bg-accent" : "bg-success"
                    }`} />
                    <span className="text-sm font-medium">{position.vault}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Earnings Summary */}
        <GlassCard>
          <h2 className="text-xl font-bold mb-4">Earnings Summary</h2>
          <div className="space-y-4">
            <div className="p-4 bg-secondary/50 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Total Earned (All Time)</p>
              <p className="text-2xl font-bold text-success">$1,247.83</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">This Month</p>
              <p className="text-2xl font-bold text-success">$234.56</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-1">Claimable Now</p>
              <p className="text-2xl font-bold text-primary">${mockPortfolio.pendingRewards}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Detailed Positions */}
      <GlassCard>
        <h2 className="text-xl font-bold mb-4">Detailed Positions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Vault</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Deposited</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Current Value</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">APY</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">P&L</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockPortfolio.positions.map((position, index) => {
                const pl = position.currentValue - position.deposited;
                const plPercentage = ((pl / position.deposited) * 100).toFixed(2);
                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/30 hover:bg-secondary/30"
                  >
                    <td className="py-3 px-2 font-medium">{position.vault}</td>
                    <td className="py-3 px-2 text-sm">${position.deposited.toLocaleString()}</td>
                    <td className="py-3 px-2 text-sm">${position.currentValue.toLocaleString()}</td>
                    <td className="py-3 px-2">
                      <BadgeCustom variant="success">{position.apy}%</BadgeCustom>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-success font-medium">
                        <div>+${pl.toFixed(2)}</div>
                        <div className="text-xs">+{plPercentage}%</div>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <BadgeCustom variant="success">{position.status}</BadgeCustom>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
