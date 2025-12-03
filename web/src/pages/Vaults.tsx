import { BadgeCustom } from "@/components/ui/badge-custom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatUSD, usePrices } from "@/hooks/usePrices";
import { useVaults, VaultInfo } from "@/hooks/useVaults";
import { useWallet } from "@/hooks/useWallet";
import { VAULT_CATEGORIES } from "@/lib/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { CheckCircle, ExternalLink, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { parseUnits } from "viem";

export default function Vaults() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVault, setSelectedVault] = useState<VaultInfo | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { isConnected, address } = useWallet();
  const {
    vaults,
    isLoading,
    deposit,
    withdraw,
    approve,
    isPending,
    isConfirming,
    txHash,
    refetch,
  } = useVaults();
  const { prices } = usePrices();

  const filteredVaults = useMemo(() => {
    if (!vaults) return [];

    return vaults.filter((vault) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Stablecoin" &&
          (vault.asset.symbol === "USDC" ||
            vault.asset.symbol === "USDT" ||
            vault.asset.symbol === "DAI")) ||
        (selectedCategory === "Blue Chip" &&
          (vault.asset.symbol === "ETH" || vault.asset.symbol === "WBTC")) ||
        (selectedCategory === "High Yield" && parseFloat(vault.apy) > 10);

      const matchesSearch =
        vault.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vault.asset.symbol.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [vaults, selectedCategory, searchQuery]);

  const featuredVault = vaults?.[0];

  const handleDeposit = async () => {
    if (!selectedVault || !depositAmount || !address) return;

    try {
      const amountBigInt = parseUnits(
        depositAmount,
        selectedVault.asset.decimals
      );

      // Check if we need approval
      if (selectedVault.userAllowance < amountBigInt) {
        toast.info("Approving token spend...");
        const approveTx = await approve(
          selectedVault.asset.address,
          selectedVault.address,
          depositAmount,
          selectedVault.asset.decimals
        );

        if (approveTx) {
          toast.success("Token approved! Now depositing...");
        }
      }

      // Deposit
      const depositTx = await deposit(
        selectedVault.address,
        depositAmount,
        selectedVault.asset.decimals
      );

      if (depositTx) {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Deposit successful!</span>
            <a
              href={`https://polygonscan.com/tx/${depositTx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              View <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        );
        setDepositAmount("");
        setIsDialogOpen(false);
        refetch();
      }
    } catch (error: any) {
      console.error("Deposit error:", error);
      toast.error(error?.message || "Deposit failed. Please try again.");
    }
  };

  const handleWithdraw = async () => {
    if (!selectedVault || !withdrawAmount) return;

    try {
      const withdrawTx = await withdraw(selectedVault.address, withdrawAmount);

      if (withdrawTx) {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Withdrawal successful!</span>
            <a
              href={`https://polygonscan.com/tx/${withdrawTx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              View <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        );
        setWithdrawAmount("");
        setIsDialogOpen(false);
        refetch();
      }
    } catch (error: any) {
      console.error("Withdraw error:", error);
      toast.error(error?.message || "Withdrawal failed. Please try again.");
    }
  };

  const openVaultDialog = (vault: VaultInfo) => {
    setSelectedVault(vault);
    setDepositAmount("");
    setWithdrawAmount("");
    setIsDialogOpen(true);
  };

  const setMaxDeposit = () => {
    if (selectedVault) {
      setDepositAmount(selectedVault.userBalance);
    }
  };

  const setMaxWithdraw = () => {
    if (selectedVault) {
      setWithdrawAmount(selectedVault.userShares);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            Loading vaults from Polygon...
          </p>
        </div>
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
            <span className="gradient-text">Privacy Vaults</span>
          </h1>
          <p className="text-muted-foreground">
            Earn yields on Polygon via Aave V3 while maintaining privacy
          </p>
        </div>
        {!isConnected && <ConnectButton />}
      </motion.div>

      {/* Featured Vault */}
      {featuredVault && (
        <GlassCard className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <BadgeCustom className="mb-2">Featured</BadgeCustom>
              <h2 className="text-2xl font-bold mb-2">{featuredVault.name}</h2>
              <p className="text-muted-foreground">
                {featuredVault.description}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-success mb-1">
                {featuredVault.apy}%
              </p>
              <p className="text-sm text-muted-foreground">APY</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">TVL</p>
              <p className="font-semibold">
                $
                {parseFloat(featuredVault.tvl).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
              <BadgeCustom
                variant={featuredVault.riskLevel === 1 ? "success" : "warning"}
              >
                {featuredVault.riskLevel === 1
                  ? "Low"
                  : featuredVault.riskLevel === 2
                  ? "Medium"
                  : "High"}
              </BadgeCustom>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
              <p className="font-semibold">
                {featuredVault.userBalance} {featuredVault.asset.symbol}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Your Position
              </p>
              <p className="font-semibold">
                {parseFloat(featuredVault.userAssets).toFixed(4)}{" "}
                {featuredVault.asset.symbol}
              </p>
            </div>
          </div>
          <GradientButton
            className="w-full"
            onClick={() => openVaultDialog(featuredVault)}
            disabled={!isConnected}
          >
            {isConnected
              ? `Deposit to ${featuredVault.asset.symbol}`
              : "Connect Wallet to Deposit"}
          </GradientButton>
        </GlassCard>
      )}

      {/* Filters */}
      <GlassCard>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {VAULT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vaults..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </GlassCard>

      {/* Vault Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVaults.map((vault, index) => (
          <motion.div
            key={vault.address}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard hover className="h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{vault.asset.icon}</span>
                    <h3 className="text-xl font-bold">{vault.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {vault.asset.symbol}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-success">
                    {vault.apy}%
                  </p>
                  <p className="text-xs text-muted-foreground">APY</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 flex-1">
                {vault.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">TVL</span>
                  <span className="font-medium">
                    $
                    {parseFloat(vault.tvl).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Risk Level
                  </span>
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
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Your Balance</span>
                  <span className="font-medium">
                    {parseFloat(vault.userBalance).toFixed(2)}{" "}
                    {vault.asset.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Your Position</span>
                  <span className="font-medium text-success">
                    {parseFloat(vault.userAssets).toFixed(4)}{" "}
                    {vault.asset.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fees</span>
                  <span className="font-medium">
                    {vault.depositFee}% / {vault.withdrawFee}%
                  </span>
                </div>
              </div>

              <GradientButton
                className="w-full"
                onClick={() => openVaultDialog(vault)}
                disabled={!isConnected}
              >
                {isConnected ? "Deposit / Withdraw" : "Connect Wallet"}
              </GradientButton>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Deposit/Withdraw Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedVault?.asset.icon}</span>
              {selectedVault?.name}
            </DialogTitle>
            <DialogDescription>
              Deposit or withdraw from this vault. Current APY:{" "}
              {selectedVault?.apy}%
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="deposit" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            </TabsList>

            <TabsContent value="deposit" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Available Balance
                  </span>
                  <span className="font-medium">
                    {parseFloat(selectedVault?.userBalance || "0").toFixed(4)}{" "}
                    {selectedVault?.asset.symbol}
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="pr-16"
                  />
                  <button
                    onClick={setMaxDeposit}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:underline"
                  >
                    MAX
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Deposit Fee: {selectedVault?.depositFee}%</span>
                  <span>
                    ≈{" "}
                    {formatUSD(
                      parseFloat(depositAmount || "0") *
                        (prices[
                          selectedVault?.asset.symbol.toLowerCase() as keyof typeof prices
                        ] || 1)
                    )}
                  </span>
                </div>
              </div>

              <GradientButton
                className="w-full"
                onClick={handleDeposit}
                disabled={
                  !depositAmount ||
                  parseFloat(depositAmount) <= 0 ||
                  isPending ||
                  isConfirming
                }
              >
                {isPending || isConfirming ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isConfirming ? "Confirming..." : "Processing..."}
                  </span>
                ) : (
                  "Deposit"
                )}
              </GradientButton>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Your Position</span>
                  <span className="font-medium">
                    {parseFloat(selectedVault?.userAssets || "0").toFixed(4)}{" "}
                    {selectedVault?.asset.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Vault Shares</span>
                  <span className="font-medium">
                    {parseFloat(selectedVault?.userShares || "0").toFixed(4)}
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Shares to redeem"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="pr-16"
                  />
                  <button
                    onClick={setMaxWithdraw}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:underline"
                  >
                    MAX
                  </button>
                </div>
                <div className="text-xs text-muted-foreground">
                  Withdrawal Fee: {selectedVault?.withdrawFee}%
                </div>
              </div>

              <GradientButton
                className="w-full"
                onClick={handleWithdraw}
                disabled={
                  !withdrawAmount ||
                  parseFloat(withdrawAmount) <= 0 ||
                  isPending ||
                  isConfirming
                }
              >
                {isPending || isConfirming ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isConfirming ? "Confirming..." : "Processing..."}
                  </span>
                ) : (
                  "Withdraw"
                )}
              </GradientButton>
            </TabsContent>
          </Tabs>

          {txHash && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Transaction:</span>
              <a
                href={`https://polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                {txHash.slice(0, 10)}...
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
