import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatUSD, usePrices } from "@/hooks/usePrices";
import { useVaults, VaultInfo } from "@/hooks/useVaults";
import { useWallet } from "@/hooks/useWallet";
import { VAULT_CATEGORIES } from "@/lib/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { CheckCircle, ExternalLink, Loader2, Search, Vault } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createPublicClient, http, parseUnits } from "viem";
import { polygon } from "viem/chains";

const publicClient = createPublicClient({
  chain: polygon,
  transport: http("https://polygon-bor-rpc.publicnode.com"),
});

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

      // Check if we need approval — approve unlimited so user only approves once
      if (selectedVault.userAllowance < amountBigInt) {
        toast.info("Step 1/2: Approving token spend...");
        const approveTx = await approve(
          selectedVault.asset.address,
          selectedVault.address
        );

        if (approveTx) {
          // Wait for approval tx to be confirmed on-chain before depositing
          toast.info("Waiting for approval confirmation...");
          await publicClient.waitForTransactionReceipt({ hash: approveTx });
          toast.success("Token approved! Now depositing...");
          // Small delay for RPC state propagation
          await new Promise(r => setTimeout(r, 2000));
        }
      }

      // Step 2: Deposit
      toast.info("Step 2/2: Depositing...");
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
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400 mx-auto mb-4" />
          <p className="text-white/40">Loading vaults from Polygon...</p>
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
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Yield Vaults</span>
          </h1>
          <p className="text-white/40 text-sm">
            Earn real yields on Polygon via Aave V3 — deposits and balances are public on-chain
          </p>
        </div>
        {!isConnected && <ConnectButton />}
      </motion.div>

      {/* Featured Vault */}
      {featuredVault && (
        <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mb-2 inline-block">Featured</span>
              <h2 className="text-xl font-bold mb-1 text-white">{featuredVault.name}</h2>
              <p className="text-white/40 text-sm">{featuredVault.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-emerald-400 mb-0.5">{featuredVault.apy}%</p>
              <p className="text-xs text-white/40">APY</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-white/40 mb-0.5">TVL</p>
              <p className="text-sm font-semibold text-white">${parseFloat(featuredVault.tvl).toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-0.5">Risk Level</p>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${featuredVault.riskLevel === 1 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}`}>
                {featuredVault.riskLevel === 1 ? "Low" : featuredVault.riskLevel === 2 ? "Medium" : "High"}
              </span>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-0.5">Your Balance</p>
              <p className="text-sm font-semibold text-white">{featuredVault.userBalance} {featuredVault.asset.symbol}</p>
            </div>
            <div>
              <p className="text-xs text-white/40 mb-0.5">Your Position</p>
              <p className="text-sm font-semibold text-white">{parseFloat(featuredVault.userAssets).toFixed(4)} {featuredVault.asset.symbol}</p>
            </div>
          </div>
          <button
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => openVaultDialog(featuredVault)}
            disabled={!isConnected}
          >
            {isConnected ? `Deposit to ${featuredVault.asset.symbol}` : "Connect Wallet to Deposit"}
          </button>
        </div>
      )}
      {/* Filters */}
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {VAULT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-emerald-600 text-white"
                    : "bg-white/[0.04] text-white/60 hover:bg-white/[0.06]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search vaults..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30"
            />
          </div>
        </div>
      </div>

      {/* Vault Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVaults.map((vault, index) => (
          <motion.div
            key={vault.address}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="h-full flex flex-col p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/20 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{vault.asset.icon}</span>
                    <h3 className="text-lg font-bold text-white">{vault.name}</h3>
                  </div>
                  <p className="text-xs text-white/40">{vault.asset.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-emerald-400">{vault.apy}%</p>
                  <p className="text-[10px] text-white/40">APY</p>
                </div>
              </div>

              <p className="text-sm text-white/40 mb-4 flex-1">{vault.description}</p>

              <div className="space-y-2.5 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">TVL</span>
                  <span className="font-medium text-white">${parseFloat(vault.tvl).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/40">Risk</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                    vault.riskLevel === 1 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                    vault.riskLevel === 2 ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                    "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    {vault.riskLevel === 1 ? "Low" : vault.riskLevel === 2 ? "Medium" : "High"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Your Balance</span>
                  <span className="font-medium text-white">{parseFloat(vault.userBalance).toFixed(2)} {vault.asset.symbol}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Position</span>
                  <span className="font-medium text-emerald-400">{parseFloat(vault.userAssets).toFixed(4)} {vault.asset.symbol}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Fees</span>
                  <span className="font-medium text-white/60">{vault.depositFee}% / {vault.withdrawFee}%</span>
                </div>
              </div>

              <button
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => openVaultDialog(vault)}
                disabled={!isConnected}
              >
                {isConnected ? "Deposit / Withdraw" : "Connect Wallet"}
              </button>
            </div>
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-emerald-400 hover:underline"
                  >
                    MAX
                  </button>
                </div>
                <div className="flex items-center justify-between text-xs text-white/40">
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

              <button
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDeposit}
                disabled={
                  !depositAmount ||
                  parseFloat(depositAmount) <= 0 ||
                  isPending ||
                  isConfirming
                }
              >
                {isPending || isConfirming ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isConfirming ? "Confirming..." : "Processing..."}
                  </span>
                ) : (
                  "Deposit"
                )}
              </button>
            </TabsContent>

            <TabsContent value="withdraw" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Your Position</span>
                  <span className="font-medium text-white">
                    {parseFloat(selectedVault?.userAssets || "0").toFixed(4)}{" "}
                    {selectedVault?.asset.symbol}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/40">Vault Shares</span>
                  <span className="font-medium text-white">
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-emerald-400 hover:underline"
                  >
                    MAX
                  </button>
                </div>
                <div className="text-xs text-white/40">
                  Withdrawal Fee: {selectedVault?.withdrawFee}%
                </div>
              </div>

              <button
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleWithdraw}
                disabled={
                  !withdrawAmount ||
                  parseFloat(withdrawAmount) <= 0 ||
                  isPending ||
                  isConfirming
                }
              >
                {isPending || isConfirming ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isConfirming ? "Confirming..." : "Processing..."}
                  </span>
                ) : (
                  "Withdraw"
                )}
              </button>
            </TabsContent>
          </Tabs>

          {txHash && (
            <div className="flex items-center justify-center gap-2 text-sm text-white/40">
              <span>Transaction:</span>
              <a
                href={`https://polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1"
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