import { BadgeCustom } from "@/components/ui/badge-custom";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { StatCard } from "@/components/ui/stat-card";
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
  DollarSign,
  Loader2,
  TrendingUp,
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

  // Calculate real portfolio data from on-chain vaults
  const portfolioData = useMemo(() => {
    if (!vaults || vaults.length === 0) {
      return {
        totalBalance: 0,
        activePositions: 0,
        pendingRewards: 0,
        change24h: 0,
      };
    }

    let totalBalance = 0;
    let activePositions = 0;

    vaults.forEach((vault) => {
      const userAssets = parseFloat(vault.userAssets) || 0;
      if (userAssets > 0) {
        // Get price for this token
        const tokenKey =
          vault.asset.symbol.toLowerCase() as keyof typeof prices;
        const price = prices[tokenKey] || 1;
        totalBalance += userAssets * price;
        activePositions++;
      }
    });

    // Add MATIC balance
    const maticValue = parseFloat(maticBalance) * prices.matic;
    totalBalance += maticValue;

    return {
      totalBalance,
      activePositions,
      pendingRewards: parseFloat(totalPending) || 0,
      change24h: 2.4, // Would need historical data for real change
    };
  }, [vaults, maticBalance, prices, totalPending]);

  // Build positions from vault data
  const positions = useMemo(() => {
    if (!vaults) return [];

    return vaults
      .filter((vault) => parseFloat(vault.userAssets) > 0)
      .map((vault) => {
        const userAssets = parseFloat(vault.userAssets) || 0;
        const tokenKey =
          vault.asset.symbol.toLowerCase() as keyof typeof prices;
        const price = prices[tokenKey] || 1;
        const currentValue = userAssets * price;

        return {
          vault: vault.name,
          symbol: vault.asset.symbol,
          deposited: userAssets,
          currentValue,
          apy: vault.apy,
          status: "Active",
        };
      });
  }, [vaults, prices]);

  const quickActions = [
    { label: "Deposit", action: () => navigate("/app/vaults") },
    { label: "Withdraw", action: () => navigate("/app/vaults") },
    { label: "Claim Rewards", action: () => {} },
    { label: "Send Stealth", action: () => navigate("/app/stealth") },
  ];

  // AI recommendations based on real vault data
  const aiRecommendations = useMemo(() => {
    if (!vaults || vaults.length === 0) return [];

    return vaults
      .sort((a, b) => parseFloat(b.apy) - parseFloat(a.apy))
      .slice(0, 3)
      .map((vault) => ({
        title: `Deposit to ${vault.name}`,
        apy: `${vault.apy}% APY`,
        reason: `${vault.description}. TVL: $${parseFloat(
          vault.tvl
        ).toLocaleString()}`,
        risk:
          vault.riskLevel === 1
            ? "LOW"
            : vault.riskLevel === 2
            ? "MEDIUM"
            : "HIGH",
      }));
  }, [vaults]);

  const displayName = hasProfile
    ? `@${userProfile?.username}`
    : username || shortAddress || "User";

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to <span className="gradient-text">NEXUS Protocol</span>
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Connect your wallet to access privacy-first DeFi vaults, stealth
            payments, and AI-powered recommendations.
          </p>
          <ConnectButton />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{displayName}</span>
          </h1>
          <p className="text-muted-foreground">
            Here's your portfolio overview
          </p>
        </div>
        <ConnectButton />
      </motion.div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Balance"
          value={
            vaultsLoading ? "Loading..." : formatUSD(portfolioData.totalBalance)
          }
          icon={
            vaultsLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Wallet className="h-5 w-5" />
            )
          }
          trend={portfolioData.change24h}
        />
        <StatCard
          label="MATIC Balance"
          value={`${maticBalance} MATIC`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Active Positions"
          value={portfolioData.activePositions}
          icon={<Activity className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Stealth"
          value={`$${portfolioData.pendingRewards.toLocaleString()}`}
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
            {vaultsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : positions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No active positions yet
                </p>
                <GradientButton onClick={() => navigate("/app/vaults")}>
                  Deposit to a Vault
                </GradientButton>
              </div>
            ) : (
              <div className="space-y-3">
                {positions.map((position, index) => (
                  <motion.div
                    key={position.vault}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-secondary/50 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{position.vault}</h3>
                      <BadgeCustom variant="success">
                        {position.status}
                      </BadgeCustom>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Deposited</p>
                        <p className="font-medium">
                          {position.deposited.toFixed(2)} {position.symbol}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current Value</p>
                        <p className="font-medium text-success">
                          {formatUSD(position.currentValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">APY</p>
                        <p className="font-medium text-primary">
                          {position.apy}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Vault</p>
                        <p className="font-medium">{position.symbol} Vault</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* AI Recommendations */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">NEXUS AI Suggests</h2>
          </div>
          {vaultsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-3">
              {aiRecommendations.map((rec, index) => (
                <motion.div
                  key={rec.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-secondary/50 rounded-lg border border-border/50"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium flex-1">{rec.title}</h4>
                    <span className="text-success text-sm font-bold">
                      {rec.apy}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {rec.reason}
                  </p>
                  <BadgeCustom
                    variant={rec.risk === "LOW" ? "success" : "warning"}
                  >
                    {rec.risk} Risk
                  </BadgeCustom>
                </motion.div>
              ))}
            </div>
          )}
          <GradientButton
            className="w-full mt-4"
            onClick={() => navigate("/app/ai")}
          >
            View AI Dashboard
          </GradientButton>
        </GlassCard>
      </div>

      {/* Vault Overview */}
      <GlassCard>
        <h2 className="text-xl font-bold mb-4">Available Vaults</h2>
        {vaultsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Vault
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Asset
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    TVL
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    APY
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Risk
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {vaults.map((vault, index) => (
                  <motion.tr
                    key={vault.address}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/30 hover:bg-secondary/30"
                  >
                    <td className="py-3 px-2 text-sm font-medium">
                      {vault.name}
                    </td>
                    <td className="py-3 px-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{vault.asset.icon}</span>
                        {vault.asset.symbol}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-sm">
                      $
                      {parseFloat(vault.tvl).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3 px-2 text-sm text-success font-medium">
                      {vault.apy}%
                    </td>
                    <td className="py-3 px-2">
                      <BadgeCustom
                        variant={
                          vault.riskLevel === 1
                            ? "success"
                            : vault.riskLevel === 2
                            ? "warning"
                            : "danger"
                        }
                      >
                        {vault.riskLevel === 1
                          ? "Low"
                          : vault.riskLevel === 2
                          ? "Medium"
                          : "High"}
                      </BadgeCustom>
                    </td>
                    <td className="py-3 px-2">
                      <GradientButton
                        size="sm"
                        onClick={() => navigate("/app/vaults")}
                      >
                        Deposit
                      </GradientButton>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
