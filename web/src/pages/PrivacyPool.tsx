import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Unlock,
  Copy,
  Download,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  Users,
  TrendingUp,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { usePrivacyPool, generateCommitment, parseNote } from "@/hooks/usePrivacyPool";
import { PRIVACY_POOL_CONFIG } from "@/lib/config";
import { toast } from "sonner";

const publicClient = createPublicClient({
  chain: polygon,
  transport: http("https://polygon-bor-rpc.publicnode.com"),
});

const PrivacyPool = () => {
  const { isConnected } = useAccount();
  const {
    poolStats,
    denominations,
    userBalance,
    userAllowance,
    isLoading,
    isPending,
    isConfirming,
    txHash,
    approveToken,
    deposit,
    withdraw,
    refetch,
  } = usePrivacyPool();

  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [selectedDenom, setSelectedDenom] = useState(0);
  const [generatedNote, setGeneratedNote] = useState<string | null>(null);
  const [noteCopied, setNoteCopied] = useState(false);
  const [withdrawNote, setWithdrawNote] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [showNote, setShowNote] = useState(false);

  const handleDeposit = async () => {
    try {
      const denom = PRIVACY_POOL_CONFIG.denominations[selectedDenom];
      if (!denom) return;

      // Generate commitment
      const note = generateCommitment(selectedDenom, denom.amount);

      // Check allowance
      if (userAllowance < denom.value) {
        toast.info("Step 1/2: Approving USDC...");
        const approveTxHash = await approveToken(denom.value);
        if (approveTxHash) {
          toast.info("Waiting for approval confirmation...");
          await publicClient.waitForTransactionReceipt({ hash: approveTxHash });
          toast.success("USDC approved! Now depositing...");
          await new Promise(r => setTimeout(r, 2000));
        }
      }

      // Deposit
      toast.info("Step 2/2: Depositing...");
      await deposit(note.commitment, selectedDenom);
      setGeneratedNote(note.noteString);
      toast.success("Deposit successful! Save your privacy note.");
      await refetch();
    } catch (error: any) {
      toast.error(error?.shortMessage || "Deposit failed");
    }
  };

  const handleWithdraw = async () => {
    try {
      const note = parseNote(withdrawNote);
      if (!note) {
        toast.error("Invalid privacy note format");
        return;
      }
      if (!recipientAddress || !recipientAddress.startsWith("0x")) {
        toast.error("Enter a valid recipient address");
        return;
      }

      await withdraw(note, recipientAddress);
      toast.success("Withdrawal successful! Funds sent to recipient.");
      setWithdrawNote("");
      setRecipientAddress("");
      await refetch();
    } catch (error: any) {
      toast.error(error?.shortMessage || "Withdrawal failed");
    }
  };

  const copyNote = () => {
    if (generatedNote) {
      navigator.clipboard.writeText(generatedNote);
      setNoteCopied(true);
      toast.success("Note copied to clipboard");
      setTimeout(() => setNoteCopied(false), 2000);
    }
  };

  const downloadNote = () => {
    if (generatedNote) {
      const blob = new Blob([generatedNote], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `nexus-privacy-note-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Note downloaded");
    }
  };

  const totalAnonymitySet = denominations.reduce((sum, d) => sum + d.anonymitySetSize, 0);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Shield className="h-16 w-16 text-emerald-500 mx-auto opacity-50" />
          <h2 className="text-2xl font-bold">Connect Wallet</h2>
          <p className="text-muted-foreground">Connect your wallet to access the Privacy Pool</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Shield className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Privacy Pool</h1>
            <p className="text-sm text-muted-foreground">
              Break on-chain sender↔receiver correlation with commitment-based deposits
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Pool TVL",
            value: poolStats ? `$${Number(poolStats.currentBalance).toLocaleString()}` : "—",
            icon: Lock,
            color: "text-emerald-400",
          },
          {
            label: "Anonymity Set",
            value: totalAnonymitySet.toString(),
            icon: Users,
            color: "text-blue-400",
          },
          {
            label: "Yield Earned",
            value: poolStats ? `$${Number(poolStats.yieldEarned).toLocaleString()}` : "—",
            icon: TrendingUp,
            color: "text-green-400",
          },
          {
            label: "Total Deposits",
            value: poolStats ? `$${Number(poolStats.totalDeposited).toLocaleString()}` : "—",
            icon: Shield,
            color: "text-purple-400",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-xl font-bold">{isLoading ? "..." : stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deposit/Withdraw Panel */}
        <div className="lg:col-span-2 bg-card/50 backdrop-blur border border-border/50 rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-border/50">
            {(["deposit", "withdraw"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-400/5"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {tab === "deposit" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  {tab === "deposit" ? "Deposit" : "Withdraw"}
                </div>
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "deposit" ? (
              <div className="space-y-6">
                {/* Denomination Selection */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Select Denomination</label>
                  <div className="grid grid-cols-3 gap-3">
                    {PRIVACY_POOL_CONFIG.denominations.map((denom, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDenom(i)}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          selectedDenom === i
                            ? "border-emerald-500 bg-emerald-500/10"
                            : "border-border/50 hover:border-emerald-500/50"
                        }`}
                      >
                        <p className="text-lg font-bold">{denom.label}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {denominations[i]
                            ? `${denominations[i].anonymitySetSize} deposits`
                            : "—"}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Balance */}
                <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Your USDC Balance</span>
                  <span className="font-medium">{Number(userBalance).toLocaleString()} USDC</span>
                </div>

                {/* Privacy Info */}
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="font-medium text-foreground">How Privacy Pool Works</p>
                      <p>1. You deposit a fixed amount and receive a <strong>secret note</strong></p>
                      <p>2. The note is your only proof of deposit — save it securely</p>
                      <p>3. Later, withdraw to <strong>any address</strong> using the note</p>
                      <p>4. No on-chain link between your deposit and withdrawal</p>
                    </div>
                  </div>
                </div>

                {/* Deposit Button */}
                <button
                  onClick={handleDeposit}
                  disabled={isPending || isConfirming || isLoading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {isPending ? "Confirm in wallet..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5" />
                      Deposit {PRIVACY_POOL_CONFIG.denominations[selectedDenom]?.label}
                    </>
                  )}
                </button>

                {/* Generated Note */}
                {generatedNote && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl space-y-3"
                  >
                    <div className="flex items-center gap-2 text-yellow-500">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-bold">SAVE YOUR PRIVACY NOTE</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This note is the ONLY way to withdraw your funds. If you lose it, your funds are lost forever.
                    </p>
                    <div className="relative">
                      <div className="bg-background/80 p-3 rounded-lg font-mono text-xs break-all max-h-24 overflow-y-auto">
                        {showNote ? generatedNote : "•".repeat(60)}
                      </div>
                      <button
                        onClick={() => setShowNote(!showNote)}
                        className="absolute top-2 right-2 p-1.5 hover:bg-background rounded"
                      >
                        {showNote ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyNote}
                        className="flex-1 py-2 bg-background border border-border rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-secondary transition-colors"
                      >
                        {noteCopied ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {noteCopied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={downloadNote}
                        className="flex-1 py-2 bg-background border border-border rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-secondary transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Tx Hash */}
                {txHash && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Transaction:</span>
                    <a
                      href={`https://polygonscan.com/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* Withdraw Tab */
              <div className="space-y-6">
                {/* Note Input */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Privacy Note</label>
                  <textarea
                    value={withdrawNote}
                    onChange={(e) => setWithdrawNote(e.target.value)}
                    placeholder="Paste your nexus-privacy-v1-... note here"
                    className="w-full h-24 bg-background/50 border border-border/50 rounded-xl p-3 text-sm font-mono resize-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none"
                  />
                </div>

                {/* Recipient Address */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Recipient Address</label>
                  <input
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="0x... (can be ANY address)"
                    className="w-full bg-background/50 border border-border/50 rounded-xl p-3 text-sm font-mono focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 outline-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Withdraw to any address — no link to your deposit address
                  </p>
                </div>

                {/* Parsed Note Info */}
                {withdrawNote && parseNote(withdrawNote) && (
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-400 text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Valid note detected</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Amount: {parseNote(withdrawNote)!.amount} USDC
                    </p>
                  </div>
                )}

                {/* Withdraw Button */}
                <button
                  onClick={handleWithdraw}
                  disabled={isPending || isConfirming || !withdrawNote || !recipientAddress}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending || isConfirming ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {isPending ? "Confirm in wallet..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <Unlock className="h-5 w-5" />
                      Withdraw Privately
                    </>
                  )}
                </button>

                {txHash && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Transaction:</span>
                    <a
                      href={`https://polygonscan.com/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Privacy Info */}
        <div className="space-y-4">
          {/* Anonymity Set per Denomination */}
          <div className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              Anonymity Sets
            </h3>
            <div className="space-y-3">
              {denominations.length > 0 ? (
                denominations.map((d) => (
                  <div key={d.index} className="flex items-center justify-between">
                    <span className="text-sm">{Number(d.amountFormatted).toLocaleString()} USDC</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-emerald-500/20 rounded-full w-20">
                        <div
                          className="h-2 bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${Math.min((d.anonymitySetSize / 50) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-emerald-400 w-8 text-right">
                        {d.anonymitySetSize}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Loading...</p>
              )}
            </div>
          </div>

          {/* Privacy Explainer */}
          <div className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              Privacy Model
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <p><strong className="text-foreground">Fixed denominations</strong> — deposits are fungible, preventing amount correlation</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <p><strong className="text-foreground">Commitment scheme</strong> — deposit identity hidden behind keccak256 hash</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <p><strong className="text-foreground">Any-address withdrawal</strong> — no on-chain link between deposit and withdrawal</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <p><strong className="text-foreground">Yield-bearing</strong> — funds earn Aave V3 yield while in the pool</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <p><strong className="text-foreground">Relayer support</strong> — third-party can submit withdrawal tx (breaks gas correlation)</p>
              </div>
            </div>
          </div>

          {/* How It Compares */}
          <div className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-emerald-400" />
              Privacy Comparison
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Standard Transfer</span>
                <span className="text-red-400">Fully Public</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Username Payments</span>
                <span className="text-yellow-400">Address Hidden</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Privacy Pool</span>
                <span className="text-emerald-400 font-medium">Link Broken ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPool;
