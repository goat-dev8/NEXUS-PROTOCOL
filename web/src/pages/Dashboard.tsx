import { formatUSD, usePrices } from "@/hooks/usePrices";
import { useStealthPay } from "@/hooks/useStealthPay";
import { useVaults } from "@/hooks/useVaults";
import { useWallet } from "@/hooks/useWallet";
import { useAppStore } from "@/stores/useAppStore";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  ChevronRight,
  DollarSign,
  Loader2,
  Shield,
  TrendingUp,
  Vault,
  Wallet,
} from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const { username } = useAppStore();
  const { isConnected, address, shortAddress, maticBalance } = useWallet();
  const { vaults, isLoading: vaultsLoading } = useVaults();
  const { userProfile, hasProfile, pendingPayments, totalPending } =
    useStealthPay();
  const { prices, isLoading: pricesLoading } = usePrices();

  const portfolioData = useMemo(() => {
    if (!vaults || vaults.length === 0) {
      return { totalBalance: 0, activePositions: 0, pendingRewards: 0, change24h: 0 };
    }
    let totalBalance = 0;
    let activePositions = 0;
    vaults.forEach((vault) => {
      const userAssets = parseFloat(vault.userAssets) || 0;
      if (userAssets > 0) {
        const tokenKey = vault.asset.symbol.toLowerCase() as keyof typeof prices;
        const price = prices[tokenKey] || 1;
        totalBalance += userAssets * price;
        activePositions++;
      }
    });
    const maticValue = parseFloat(maticBalance) * prices.matic;
    totalBalance += maticValue;
    return { totalBalance, activePositions, pendingRewards: parseFloat(totalPending) || 0, change24h: 2.4 };
  }, [vaults, maticBalance, prices, totalPending]);

  const positions = useMemo(() => {
    if (!vaults) return [];
    return vaults
      .filter((vault) => parseFloat(vault.userAssets) > 0)
      .map((vault) => {
        const userAssets = parseFloat(vault.userAssets) || 0;
        const tokenKey = vault.asset.symbol.toLowerCase() as keyof typeof prices;
        const price = prices[tokenKey] || 1;
        return {
          vault: vault.name,
          symbol: vault.asset.symbol,
          deposited: userAssets,
          currentValue: userAssets * price,
          apy: vault.apy,
        };
      });
  }, [vaults, prices]);

  const quickActions = [
    { label: "Deposit", icon: Vault, action: () => navigate("/app/vaults") },
    { label: "Privacy Pool", icon: Shield, action: () => navigate("/app/privacy") },
    { label: "Send Payment", icon: DollarSign, action: () => navigate("/app/stealth") },
    { label: "AI Agent", icon: Brain, action: () => navigate("/app/ai") },
  ];

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

  const displayName = hasProfile
    ? `@${userProfile?.username}`
    : username || shortAddress || "User";

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Shield className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Nexus Protocol</span>
          </h1>
          <p className="text-white/40 mb-8 max-w-md mx-auto">
            Connect your wallet to access yield vaults, privacy pool, and @username payments on Polygon.
          </p>
          <ConnectButton />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-white">
            Welcome back, <span className="text-emerald-400">{displayName}</span>
          </h1>
          <p className="text-white/40 text-sm">Portfolio overview on Polygon Mainnet</p>
        </div>
        <ConnectButton />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Balance", value: vaultsLoading ? "..." : formatUSD(portfolioData.totalBalance), icon: Wallet, trend: portfolioData.change24h },
          { label: "MATIC Balance", value: `${parseFloat(maticBalance).toFixed(4)}`, icon: TrendingUp },
          { label: "Active Positions", value: `${portfolioData.activePositions}`, icon: Activity },
          { label: "Pending Payments", value: `$${portfolioData.pendingRewards.toLocaleString()}`, icon: DollarSign },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-5 w-5 text-emerald-400" />
              {stat.trend && stat.trend > 0 && (
                <span className="text-xs text-emerald-400 font-medium">+{stat.trend}%</span>
              )}
            </div>
            <p className="text-2xl font-bold text-white mb-0.5">
              {vaultsLoading ? <Loader2 className="h-5 w-5 animate-spin text-white/30" /> : stat.value}
            </p>
            <p className="text-xs text-white/40">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={action.action}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-emerald-500/20 transition-all"
            >
              <action.icon className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-white/80">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Positions */}
        <div className="lg:col-span-2">
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Active Positions</h2>
            {vaultsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
              </div>
            ) : positions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/40 mb-4">No active positions yet</p>
                <button onClick={() => navigate("/app/vaults")} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors">
                  Deposit to a Vault
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {positions.map((position, index) => (
                  <motion.div
                    key={position.vault}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-white">{position.vault}</h3>
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">Active</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-white/40 text-xs mb-0.5">Deposited</p>
                        <p className="font-medium text-white">{position.deposited.toFixed(2)} {position.symbol}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs mb-0.5">Value</p>
                        <p className="font-medium text-emerald-400">{formatUSD(position.currentValue)}</p>
                      </div>
                      <div>
                        <p className="text-white/40 text-xs mb-0.5">APY</p>
                        <p className="font-medium text-white">{position.apy}%</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">AI Suggestions</h2>
          </div>
          {vaultsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
            </div>
          ) : (
            <div className="space-y-3">
              {aiRecommendations.map((rec, index) => (
                <motion.div
                  key={rec.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-white/80 flex-1">{rec.title}</h4>
                    <span className="text-emerald-400 text-sm font-bold">{rec.apy}</span>
                  </div>
                  <p className="text-xs text-white/30 mb-2">{rec.reason}</p>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${rec.risk === "LOW" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                    {rec.risk} Risk
                  </span>
                </motion.div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate("/app/ai")}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors"
          >
            View AI Dashboard
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Vault Overview Table */}
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Available Vaults</h2>
        {vaultsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Vault", "Asset", "TVL", "APY", "Risk", ""].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-medium text-white/30 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vaults.map((vault, index) => (
                  <motion.tr
                    key={vault.address}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02]"
                  >
                    <td className="py-3 px-3 text-sm font-medium text-white">{vault.name}</td>
                    <td className="py-3 px-3 text-sm text-white/60">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{vault.asset.icon}</span>
                        {vault.asset.symbol}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-white/60">
                      ${parseFloat(vault.tvl).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 text-sm text-emerald-400 font-medium">{vault.apy}%</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        vault.riskLevel === 1
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : vault.riskLevel === 2
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}>
                        {vault.riskLevel === 1 ? "Low" : vault.riskLevel === 2 ? "Medium" : "High"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => navigate("/app/vaults")}
                        className="px-4 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors"
                      >
                        Deposit
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
