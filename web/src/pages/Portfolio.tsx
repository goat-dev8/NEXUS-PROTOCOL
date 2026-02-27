import { mockPortfolio } from "@/lib/mock-data";
import { Wallet, TrendingUp, Activity, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function Portfolio() {
  const stats = [
    { label: "Total Balance", value: "$12,450.00", icon: Wallet, change: "+12.5%" },
    { label: "Total Earnings", value: "$1,834.50", icon: DollarSign, change: "+8.2%" },
    { label: "Active Positions", value: "4", icon: Activity, change: null },
    { label: "Avg APY", value: "5.8%", icon: TrendingUp, change: "+0.3%" },
  ];

  const positions = [
    { asset: "USDC", vault: "USDC Vault", deposited: "$5,000.00", current: "$5,225.00", apy: "4.5%", earnings: "$225.00" },
    { asset: "USDT", vault: "USDT Vault", deposited: "$3,000.00", current: "$3,158.40", apy: "5.28%", earnings: "$158.40" },
    { asset: "DAI", vault: "DAI Vault", deposited: "$2,000.00", current: "$2,117.20", apy: "5.86%", earnings: "$117.20" },
    { asset: "MATIC", vault: "Privacy Pool", deposited: "$2,450.00", current: "$2,450.00", apy: "—", earnings: "$0.00" },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Portfolio</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">Overview of your positions and earnings across Nexus Protocol.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
            className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-5 w-5 text-emerald-400" />
              {stat.change && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/40 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Chart placeholder */}
        <div className="lg:col-span-3 p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Portfolio Value</h2>
          <div className="h-[240px] flex items-center justify-center border border-dashed border-white/10 rounded-xl">
            <div className="text-center">
              <TrendingUp className="h-10 w-10 text-emerald-500/30 mx-auto mb-2" />
              <p className="text-white/20 text-sm">Portfolio chart</p>
              <p className="text-white/10 text-xs">Connect wallet to view</p>
            </div>
          </div>
        </div>

        {/* Allocation */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Asset Allocation</h2>
          <div className="h-[120px] flex items-center justify-center mb-4">
            <div className="w-28 h-28 rounded-full border-[8px] border-emerald-400 border-t-green-400 border-l-emerald-600 border-b-emerald-800 flex items-center justify-center">
              <span className="text-white font-bold text-sm">$12.4K</span>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { asset: "USDC", pct: 40, color: "bg-emerald-400" },
              { asset: "USDT", pct: 24, color: "bg-green-400" },
              { asset: "DAI", pct: 16, color: "bg-emerald-600" },
              { asset: "Privacy Pool", pct: 20, color: "bg-emerald-800" },
            ].map((item) => (
              <div key={item.asset} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-xs text-white/60 flex-1">{item.asset}</span>
                <span className="text-xs font-medium text-white">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Earnings Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Today", value: "+$12.34" },
            { label: "This Week", value: "+$89.23" },
            { label: "All Time", value: "+$1,834.50" },
          ].map((item) => (
            <div key={item.label} className="text-center p-3 rounded-xl bg-white/[0.02]">
              <p className="text-emerald-400 font-bold text-lg">{item.value}</p>
              <p className="text-[10px] text-white/30 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Positions Table */}
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Active Positions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] text-white/30 uppercase tracking-wider">
                <th className="pb-3 pr-4">Asset</th>
                <th className="pb-3 pr-4">Vault</th>
                <th className="pb-3 pr-4 text-right">Deposited</th>
                <th className="pb-3 pr-4 text-right">Current Value</th>
                <th className="pb-3 pr-4 text-right">APY</th>
                <th className="pb-3 text-right">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos, index) => (
                <motion.tr key={pos.asset} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
                  className="border-t border-white/5">
                  <td className="py-3 pr-4">
                    <span className="font-medium text-white">{pos.asset}</span>
                  </td>
                  <td className="py-3 pr-4 text-white/40">{pos.vault}</td>
                  <td className="py-3 pr-4 text-right text-white/60">{pos.deposited}</td>
                  <td className="py-3 pr-4 text-right font-medium text-white">{pos.current}</td>
                  <td className="py-3 pr-4 text-right text-emerald-400">{pos.apy}</td>
                  <td className="py-3 text-right text-emerald-400">{pos.earnings}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
