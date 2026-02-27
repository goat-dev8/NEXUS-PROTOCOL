import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStealthPay } from "@/hooks/useStealthPay";
import { useVaults } from "@/hooks/useVaults";
import { useWallet } from "@/hooks/useWallet";
import { CONTRACTS, TOKENS } from "@/lib/config";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Copy,
  ExternalLink,
  Loader2,
  Send,
  Shield,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createPublicClient, http, parseUnits } from "viem";
import { polygon } from "viem/chains";

const publicClient = createPublicClient({
  chain: polygon,
  transport: http("https://polygon-bor-rpc.publicnode.com"),
});

export default function StealthPay() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("USDC");
  const [note, setNote] = useState("");
  const [selectedTab, setSelectedTab] = useState<"sent" | "received" | "all">("all");
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  const { isConnected, address, shortAddress } = useWallet();
  const { vaults } = useVaults();
  const {
    userProfile,
    hasProfile,
    registrationFee,
    pendingPayments,
    sentPayments,
    totalPending,
    isPending,
    isConfirming,
    txHash,
    registerUsername,
    sendPayment,
    claimPayment,
    approveToken,
    refetch,
  } = useStealthPay();

  const tokenBalances = useMemo(() => {
    if (!vaults) return {};
    const balances: Record<string, string> = {};
    vaults.forEach((vault) => {
      balances[vault.asset.symbol] = vault.userBalance;
    });
    return balances;
  }, [vaults]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleRegisterUsername = async () => {
    if (!newUsername) {
      toast.error("Please enter a username");
      return;
    }
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(newUsername)) {
      toast.error("Username must be 3-20 characters, lowercase letters, numbers, and underscores only");
      return;
    }
    try {
      const txHash = await registerUsername(newUsername);
      if (txHash) {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Username @{newUsername} registered!</span>
            <a href={`https://polygonscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
              View <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        );
        setIsRegisterDialogOpen(false);
        setNewUsername("");
        refetch();
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error?.message || "Registration failed. Please try again.");
    }
  };

  const handleSendPayment = async () => {
    if (!recipient || !amount) {
      toast.error("Please enter recipient and amount");
      return;
    }
    const formattedRecipient = recipient.startsWith("@") ? recipient.slice(1) : recipient;
    try {
      const tokenInfo = TOKENS[selectedToken as keyof typeof TOKENS];
      const amountBigInt = parseUnits(amount, tokenInfo.decimals);
      toast.info("Step 1/2: Approving token spend...");
      const approveTx = await approveToken(tokenInfo.address as `0x${string}`, amount, tokenInfo.decimals);
      if (approveTx) {
        toast.info("Waiting for approval confirmation...");
        await publicClient.waitForTransactionReceipt({ hash: approveTx });
        toast.success("Token approved! Sending payment...");
        await new Promise(r => setTimeout(r, 2000));
      }
      toast.info("Step 2/2: Sending payment...");
      const sendTx = await sendPayment(formattedRecipient, tokenInfo.address as `0x${string}`, amount, tokenInfo.decimals, note);
      if (sendTx) {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Payment sent to @{formattedRecipient}!</span>
            <a href={`https://polygonscan.com/tx/${sendTx}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
              View <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        );
        setRecipient("");
        setAmount("");
        setNote("");
        refetch();
      }
    } catch (error: any) {
      console.error("Send error:", error);
      toast.error(error?.message || "Failed to send payment. Please try again.");
    }
  };

  const handleClaimPayment = async (paymentId: `0x${string}`) => {
    try {
      const claimTx = await claimPayment(paymentId);
      if (claimTx) {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Payment claimed successfully!</span>
            <a href={`https://polygonscan.com/tx/${claimTx}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center gap-1">
              View <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        );
        refetch();
      }
    } catch (error: any) {
      console.error("Claim error:", error);
      toast.error(error?.message || "Failed to claim payment. Please try again.");
    }
  };

  const allTransactions = useMemo(() => {
    const sent = sentPayments.map((p) => ({ ...p, type: "Sent" as const }));
    const received = pendingPayments.map((p) => ({ ...p, type: "Received" as const }));
    const all = [...sent, ...received].sort((a, b) => b.timestamp - a.timestamp);
    if (selectedTab === "all") return all;
    return all.filter((tx) => tx.type.toLowerCase() === selectedTab);
  }, [sentPayments, pendingPayments, selectedTab]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <Send className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">@Username Payments</span>
          </h1>
          <p className="text-white/40 mb-8 max-w-md mx-auto">
            Connect your wallet to send and receive payments using @usernames. Merchants see your username, not your wallet address.
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
          <div className="flex items-center gap-3 mb-1">
            <Send className="h-6 w-6 text-emerald-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">@Username Payments</span>
            </h1>
          </div>
          <p className="text-white/40 text-sm">
            Send funds via usernames on Polygon — address abstracted from merchants
          </p>
        </div>
        <ConnectButton />
      </motion.div>

      {/* Username Registration Banner */}
      {!hasProfile && (
        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03]">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6 text-emerald-400" />
              <div>
                <h3 className="font-bold text-white">Register Your @username</h3>
                <p className="text-sm text-white/40">Get a unique username to receive payments. Fee: {registrationFee} MATIC</p>
              </div>
            </div>
            <button onClick={() => setIsRegisterDialogOpen(true)} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors">
              Register Now
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Send Card */}
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Send className="h-4 w-4 text-emerald-400" />
            Send Payment
          </h2>
          <div className="space-y-4">
            <div>
              <Label className="text-white/60 text-xs">Recipient (@username)</Label>
              <Input placeholder="@alice" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="mt-1 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30" />
              <p className="text-[10px] text-white/30 mt-1">Enter the recipient's registered username</p>
            </div>

            <div>
              <Label className="text-white/60 text-xs">Asset</Label>
              <select
                className="w-full mt-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
              >
                {Object.entries(TOKENS).map(([key, token]) => (
                  <option key={key} value={key} className="bg-[#0a0a0a]">
                    {token.icon} {token.symbol} — {parseFloat(tokenBalances[token.symbol] || "0").toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-white/60 text-xs">Amount</Label>
              <div className="relative mt-1">
                <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/30" />
                <button onClick={() => setAmount(tokenBalances[selectedToken] || "0")} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 text-xs font-medium">MAX</button>
              </div>
            </div>

            <div>
              <Label className="text-white/60 text-xs">Note (Optional)</Label>
              <Input placeholder="Add a note..." value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30" />
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-white/40">Estimated Gas</span>
                <span className="font-medium text-white/60">~0.001 MATIC</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <Shield className="h-3 w-3" />
                <span>Username-based Payment via Nexus Protocol</span>
              </div>
            </div>

            <button
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handleSendPayment}
              disabled={!recipient || !amount || isPending || isConfirming}
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isConfirming ? "Confirming..." : "Processing..."}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Payment
                </>
              )}
            </button>
          </div>
        </div>

        {/* Receive Card */}
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Receive</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-white/60 text-xs">Your Wallet</Label>
              <div className="flex gap-2 mt-1">
                <Input value={address || ""} readOnly className="flex-1 font-mono text-xs bg-white/[0.04] border-white/10 text-white/60" />
                <button onClick={() => handleCopy(address || "")} className="p-2 bg-white/[0.04] hover:bg-white/[0.06] rounded-lg transition-colors border border-white/5">
                  <Copy className="h-4 w-4 text-white/50" />
                </button>
              </div>
            </div>

            <div>
              <Label className="text-white/60 text-xs">Your @username</Label>
              {hasProfile ? (
                <div className="flex gap-2 mt-1">
                  <Input value={`@${userProfile?.username}`} readOnly className="flex-1 bg-white/[0.04] border-white/10 text-emerald-400" />
                  <button onClick={() => handleCopy(`@${userProfile?.username}`)} className="p-2 bg-white/[0.04] hover:bg-white/[0.06] rounded-lg transition-colors border border-white/5">
                    <Copy className="h-4 w-4 text-white/50" />
                  </button>
                </div>
              ) : (
                <div className="mt-1 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                  <p className="text-sm text-white/40 mb-2">No username registered</p>
                  <button onClick={() => setIsRegisterDialogOpen(true)} className="px-4 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors">
                    Register Username
                  </button>
                </div>
              )}
            </div>

            {hasProfile && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                <p className="text-2xl font-bold text-emerald-400 mb-0.5">${totalPending}</p>
                <p className="text-xs text-white/40">Pending Payments</p>
                <p className="text-[10px] text-white/30 mt-1">{pendingPayments.length} payment(s) waiting</p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-yellow-500/[0.05] border border-yellow-500/10">
              <p className="text-sm text-white/60">
                <strong className="text-yellow-400">Privacy Note:</strong> Username payments abstract your wallet address from merchants, but correlation via deposit timing is possible. For stronger privacy, use the <span className="text-emerald-400">Privacy Pool</span>.
              </p>
            </div>

            <div className="text-center text-xs text-white/30">
              <p>Contract:</p>
              <a href={`https://polygonscan.com/address/${CONTRACTS.STEALTH_REGISTRY}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline flex items-center justify-center gap-1">
                {CONTRACTS.STEALTH_REGISTRY.slice(0, 10)}...{CONTRACTS.STEALTH_REGISTRY.slice(-8)}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Payments */}
      {pendingPayments.length > 0 && (
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            Pending Claims
          </h2>
          <div className="space-y-3">
            {pendingPayments.map((payment, index) => (
              <motion.div
                key={payment.paymentId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-white">{payment.amount} {payment.tokenSymbol}</p>
                  <p className="text-[10px] text-white/30 font-mono">ID: {payment.paymentId.slice(0, 10)}...</p>
                </div>
                <button
                  onClick={() => handleClaimPayment(payment.paymentId)}
                  disabled={isPending || isConfirming}
                  className="px-4 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition-colors disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Claim"}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Transaction History</h2>

        <div className="flex gap-2 mb-4">
          {["all", "sent", "received"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                selectedTab === tab ? "bg-emerald-600 text-white" : "bg-white/[0.04] text-white/60 hover:bg-white/[0.06]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {allTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Send className="h-10 w-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/40 text-sm">No transactions yet</p>
            <p className="text-white/30 text-xs">Send your first payment to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {["Type", "To/From", "Amount", "Status", "ID"].map((h) => (
                    <th key={h} className="text-left py-3 px-3 text-xs font-medium text-white/30 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allTransactions.map((tx, index) => (
                  <motion.tr
                    key={tx.paymentId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02]"
                  >
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        tx.type === "Sent" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm text-white/60">
                      {tx.type === "Sent" ? tx.recipientUsername : "You"}
                    </td>
                    <td className="py-3 px-3 text-sm font-medium text-white">
                      {tx.amount} {tx.tokenSymbol}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                        tx.claimed ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}>
                        {tx.claimed ? "Claimed" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[10px] font-mono text-white/30">{tx.paymentId.slice(0, 12)}...</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Username Registration Dialog */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-emerald-400" />
              Register Your @username
            </DialogTitle>
            <DialogDescription>
              Choose a unique username to receive payments. This costs {registrationFee} MATIC.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="text-white/60 text-xs">Username</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">@</span>
                <Input
                  placeholder="your_username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                  className="pl-8 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <p className="text-[10px] text-white/30 mt-1">3-20 characters: lowercase letters, numbers, underscores</p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Registration Fee</span>
                <span className="font-medium text-white">{registrationFee} MATIC</span>
              </div>
            </div>

            <button
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={handleRegisterUsername}
              disabled={!newUsername || isPending || isConfirming}
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isConfirming ? "Confirming..." : "Processing..."}
                </>
              ) : (
                "Register Username"
              )}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
