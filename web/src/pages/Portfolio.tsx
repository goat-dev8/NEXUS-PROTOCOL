import { formatUSD, usePrices } from "@/hooks/usePrices";
import { useVaults } from "@/hooks/useVaults";
import { useWallet } from "@/hooks/useWallet";
import { Wallet, TrendingUp, Activity, DollarSign, Loader2, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Portfolio() {
  const { isConnected, maticBalance } = useWallet();
  const { vaults, isLoading } = useVaults();
  const { prices } = usePrices();

  // Compute real portfolio data from vaults
  const portfolioData = useMemo(() => {
    if (!vaults || vaults.length === 0) {
      return { totalBalance: 0, activePositions: 0, avgApy: 0 };
    }

    let totalBalance = 0;
    let activePositions = 0;
    let totalApy = 0;
    let apyCount = 0;

    vaults.forEach((vault) => {
      const userAssets = parseFloat(vault.userAssets) || 0;
      if (userAssets > 0) {
        const tokenKey = vault.asset.symbol.toLowerCase() as keyof typeof prices;
        const price = prices[tokenKey] || 1;
        totalBalance += userAssets * price;
        activePositions++;
        totalApy += parseFloat(vault.apy) || 0;
        apyCount++;
      }
    });

    const maticValue = parseFloat(maticBalance) * prices.matic;
    totalBalance += maticValue;
    const avgApy = apyCount > 0 ? totalApy / apyCount : 0;

    return { totalBalance, activePositions, avgApy };
  }, [vaults, maticBalance, prices]);

  // Real positions from vault data
  const positions = useMemo(() => {
    if (!vaults) return [];
    return vaults
      .filter((vault) => parseFloat(vault.userAssets) > 0)
      .map((vault) => {
        const userAssets = parseFloat(vault.userAssets) || 0;
        const tokenKey = vault.asset.symbol.toLowerCase() as keyof typeof prices;
        const price = prices[tokenKey] || 1;
        const currentValue = userAssets * price;
        return {
          asset: vault.asset.symbol,
          vault: vault.name,
          deposited: userAssets,
          currentValue,
          apy: vault.apy,
          icon: vault.asset.icon,
        };
      });
  }, [vaults, prices]);

  // Asset allocation from real data
  const allocation = useMemo(() => {
    if (portfolioData.totalBalance === 0 || positions.length === 0) return [];
    return positions.map((pos) => ({
      asset: pos.asset,
      pct: Math.round((pos.currentValue / portfolioData.totalBalance) * 100),
      color:
        pos.asset === "USDC"
          ? "bg-emerald-400"
          : pos.asset === "USDT"
          ? "bg-green-400"
          : pos.asset === "DAI"
          ? "bg-emerald-600"
          : "bg-emerald-800",
    }));
  }, [positions, portfolioData.totalBalance]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Shield className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 text-white">Connect Wallet</h1>
          <p className="text-white/40 text-sm mb-6">Connect your wallet to view your portfolio</p>
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

  const stats = [
    { label: "Total Balance", value: formatUSD(portfolioData.totalBalance), icon: Wallet },
    { label: "Active Positions", value: String(portfolioData.activePositions), icon: Activity },
    { label: "Avg APY", value: `${portfolioData.avgApy.toFixed(2)}%`, icon: TrendingUp },
    { label: "MATIC Balance", value: `${parseFloat(maticBalance).toFixed(4)}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Portfolio</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">Real-time overview of your positions across Nexus Protocol vaults.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
            className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-white/40 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Portfolio Summary */}
        <div className="lg:col-span-3 p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Portfolio Summary</h2>
          {positions.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center border border-dashed border-white/10 rounded-xl">
              <div className="text-center">
                <TrendingUp className="h-10 w-10 text-emerald-500/30 mx-auto mb-2" />
                <p className="text-white/20 text-sm">No active positions</p>
                <p className="text-white/10 text-xs">Deposit to a vault to get started</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {positions.map((pos, index) => (
                <motion.div key={pos.asset} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{pos.icon}</span>
                      <div>
                        <p className="font-medium text-white">{pos.asset}</p>
                        <p className="text-xs text-white/40">{pos.vault}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{formatUSD(pos.currentValue)}</p>
                      <p className="text-xs text-emerald-400">{pos.apy}% APY</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Allocation */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Asset Allocation</h2>
          {allocation.length === 0 ? (
            <div className="h-[120px] flex items-center justify-center">
              <p className="text-white/20 text-sm">No allocations yet</p>
            </div>
          ) : (
            <>
              <div className="h-[120px] flex items-center justify-center mb-4">
                <div className="w-28 h-28 rounded-full border-[8px] border-emerald-400 border-t-green-400 border-l-emerald-600 border-b-emerald-800 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{formatUSD(portfolioData.totalBalance)}</span>
                </div>
              </div>
              <div className="space-y-2">
                {allocation.map((item) => (
                  <div key={item.asset} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                    <span className="text-xs text-white/60 flex-1">{item.asset}</span>
                    <span className="text-xs font-medium text-white">{item.pct}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Positions Table */}
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Active Positions</h2>
        {positions.length === 0 ? (
          <p className="text-center text-white/20 py-8">No active positions. Deposit to a vault to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] text-white/30 uppercase tracking-wider">
                  <th className="pb-3 pr-4">Asset</th>
                  <th className="pb-3 pr-4">Vault</th>
                  <th className="pb-3 pr-4 text-right">Amount</th>
                  <th className="pb-3 pr-4 text-right">Value (USD)</th>
                  <th className="pb-3 text-right">APY</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos, index) => (
                  <motion.tr key={pos.asset} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
                    className="border-t border-white/5">
                    <td className="py-3 pr-4">
                      <span className="font-medium text-white">{pos.icon} {pos.asset}</span>
                    </td>
                    <td className="py-3 pr-4 text-white/40">{pos.vault}</td>
                    <td className="py-3 pr-4 text-right text-white/60">{pos.deposited.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                    <td className="py-3 pr-4 text-right font-medium text-white">{formatUSD(pos.currentValue)}</td>
                    <td className="py-3 text-right text-emerald-400">{pos.apy}%</td>
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
