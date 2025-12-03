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
  Ghost,
  Loader2,
  Shield,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { parseUnits } from "viem";

export default function StealthPay() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("USDC");
  const [note, setNote] = useState("");
  const [selectedTab, setSelectedTab] = useState<"sent" | "received" | "all">(
    "all"
  );
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

  const stealthAddress = address
    ? `stealth:${address.slice(0, 6)}...${address.slice(-4)}`
    : "Connect wallet";

  // Get user's token balances from vaults hook (for USDC, USDT, DAI)
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

    // Validate username format
    const usernameRegex = /^[a-z0-9_]{3,20}$/;
    if (!usernameRegex.test(newUsername)) {
      toast.error(
        "Username must be 3-20 characters, lowercase letters, numbers, and underscores only"
      );
      return;
    }

    try {
      const txHash = await registerUsername(newUsername);
      if (txHash) {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Username @{newUsername} registered!</span>
            <a
              href={`https://polygonscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
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

    // Format recipient - remove @ if present
    const formattedRecipient = recipient.startsWith("@")
      ? recipient.slice(1)
      : recipient;

    try {
      const tokenInfo = TOKENS[selectedToken as keyof typeof TOKENS];
      const amountBigInt = parseUnits(amount, tokenInfo.decimals);

      // First approve the token
      toast.info("Approving token spend...");
      const approveTx = await approveToken(
        tokenInfo.address as `0x${string}`,
        amount,
        tokenInfo.decimals
      );

      if (approveTx) {
        toast.success("Token approved! Sending payment...");
      }

      // Send the payment
      const sendTx = await sendPayment(
        formattedRecipient,
        tokenInfo.address as `0x${string}`,
        amount,
        tokenInfo.decimals,
        note
      );

      if (sendTx) {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Payment sent to @{formattedRecipient}!</span>
            <a
              href={`https://polygonscan.com/tx/${sendTx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
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
      toast.error(
        error?.message || "Failed to send payment. Please try again."
      );
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
            <a
              href={`https://polygonscan.com/tx/${claimTx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              View <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        );
        refetch();
      }
    } catch (error: any) {
      console.error("Claim error:", error);
      toast.error(
        error?.message || "Failed to claim payment. Please try again."
      );
    }
  };

  // Combine and filter transactions
  const allTransactions = useMemo(() => {
    const sent = sentPayments.map((p) => ({ ...p, type: "Sent" as const }));
    const received = pendingPayments.map((p) => ({
      ...p,
      type: "Received" as const,
    }));
    const all = [...sent, ...received].sort(
      (a, b) => b.timestamp - a.timestamp
    );

    if (selectedTab === "all") return all;
    return all.filter((tx) => tx.type.toLowerCase() === selectedTab);
  }, [sentPayments, pendingPayments, selectedTab]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Ghost className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Stealth Payments</span>
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Connect your wallet to send and receive private payments using
            @usernames.
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
          <div className="flex items-center gap-3 mb-2">
            <Ghost className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="gradient-text">Stealth Payments</span>
            </h1>
          </div>
          <p className="text-muted-foreground">
            Send funds privately using @usernames on Polygon
          </p>
        </div>
        <ConnectButton />
      </motion.div>

      {/* Username Registration Banner */}
      {!hasProfile && (
        <GlassCard className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-bold">Register Your @username</h3>
                <p className="text-sm text-muted-foreground">
                  Get a unique username to receive stealth payments.
                  Registration fee: {registrationFee} MATIC
                </p>
              </div>
            </div>
            <GradientButton onClick={() => setIsRegisterDialogOpen(true)}>
              Register Now
            </GradientButton>
          </div>
        </GlassCard>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Send Card */}
        <GlassCard>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Ghost className="h-5 w-5 text-primary" />
            Send Privately
          </h2>
          <div className="space-y-4">
            <div>
              <Label>Recipient (@username)</Label>
              <Input
                placeholder="@alice"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the recipient's registered username (without @ or with @)
              </p>
            </div>

            <div>
              <Label>Asset</Label>
              <select
                className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2"
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
              >
                {Object.entries(TOKENS).map(([key, token]) => (
                  <option key={key} value={key}>
                    {token.icon} {token.symbol} - Balance:{" "}
                    {parseFloat(tokenBalances[token.symbol] || "0").toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Amount</Label>
              <div className="relative mt-1">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button
                  onClick={() => setAmount(tokenBalances[selectedToken] || "0")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-sm font-medium"
                >
                  MAX
                </button>
              </div>
            </div>

            <div>
              <Label>Note (Optional, Encrypted)</Label>
              <Input
                placeholder="Add a private note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="p-3 bg-secondary/50 rounded-lg border border-border/50">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Estimated Gas</span>
                <span className="font-medium">~0.001 MATIC</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-primary">
                <Shield className="h-3 w-3" />
                <span>Stealth Payment via NEXUS Protocol</span>
              </div>
            </div>

            <GradientButton
              className="w-full"
              onClick={handleSendPayment}
              disabled={!recipient || !amount || isPending || isConfirming}
            >
              {isPending || isConfirming ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isConfirming ? "Confirming..." : "Processing..."}
                </span>
              ) : (
                <>
                  <Ghost className="h-4 w-4 mr-2" />
                  Send Privately
                </>
              )}
            </GradientButton>
          </div>
        </GlassCard>

        {/* Receive Card */}
        <GlassCard>
          <h2 className="text-xl font-bold mb-4">Receive</h2>
          <div className="space-y-4">
            <div>
              <Label>Your Wallet Address</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={address || ""}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <button
                  onClick={() => handleCopy(address || "")}
                  className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <Label>Your @username</Label>
              {hasProfile ? (
                <div className="flex gap-2 mt-1">
                  <Input
                    value={`@${userProfile?.username}`}
                    readOnly
                    className="flex-1"
                  />
                  <button
                    onClick={() => handleCopy(`@${userProfile?.username}`)}
                    className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="mt-1 p-3 bg-secondary/50 rounded-lg border border-border/50 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    No username registered
                  </p>
                  <GradientButton
                    size="sm"
                    onClick={() => setIsRegisterDialogOpen(true)}
                  >
                    Register Username
                  </GradientButton>
                </div>
              )}
            </div>

            {hasProfile && (
              <div className="p-4 bg-secondary/50 rounded-lg border border-border/50 text-center">
                <p className="text-2xl font-bold text-primary mb-1">
                  ${totalPending}
                </p>
                <p className="text-sm text-muted-foreground">
                  Pending Payments
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {pendingPayments.length} payment(s) waiting to be claimed
                </p>
              </div>
            )}

            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <strong>Privacy Note:</strong> Stealth payments use encrypted
                escrow. Only the recipient can claim funds using their
                registered @username.
              </p>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Contract Address:</p>
              <a
                href={`https://polygonscan.com/address/${CONTRACTS.STEALTH_REGISTRY}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center justify-center gap-1"
              >
                {CONTRACTS.STEALTH_REGISTRY.slice(0, 10)}...
                {CONTRACTS.STEALTH_REGISTRY.slice(-8)}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Pending Payments to Claim */}
      {pendingPayments.length > 0 && (
        <GlassCard>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Pending Payments to Claim
          </h2>
          <div className="space-y-3">
            {pendingPayments.map((payment, index) => (
              <motion.div
                key={payment.paymentId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-secondary/50 rounded-lg border border-border/50 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {payment.amount} {payment.tokenSymbol}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Payment ID: {payment.paymentId.slice(0, 10)}...
                  </p>
                </div>
                <GradientButton
                  size="sm"
                  onClick={() => handleClaimPayment(payment.paymentId)}
                  disabled={isPending || isConfirming}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Claim"
                  )}
                </GradientButton>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Transaction History */}
      <GlassCard>
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>

        <div className="flex gap-2 mb-4">
          {["all", "sent", "received"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                selectedTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {allTransactions.length === 0 ? (
          <div className="text-center py-8">
            <Ghost className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No stealth transactions yet</p>
            <p className="text-sm text-muted-foreground">
              Send your first stealth payment to get started
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    To/From
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">
                    Payment ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {allTransactions.map((tx, index) => (
                  <motion.tr
                    key={tx.paymentId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border/30 hover:bg-secondary/30"
                  >
                    <td className="py-3 px-2">
                      <BadgeCustom
                        variant={tx.type === "Sent" ? "warning" : "success"}
                      >
                        {tx.type}
                      </BadgeCustom>
                    </td>
                    <td className="py-3 px-2 text-sm">
                      {tx.type === "Sent" ? tx.recipientUsername : "You"}
                    </td>
                    <td className="py-3 px-2 text-sm font-medium">
                      {tx.amount} {tx.tokenSymbol}
                    </td>
                    <td className="py-3 px-2">
                      <BadgeCustom variant={tx.claimed ? "success" : "warning"}>
                        {tx.claimed ? "Claimed" : "Pending"}
                      </BadgeCustom>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        {tx.paymentId.slice(0, 12)}...
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Username Registration Dialog */}
      <Dialog
        open={isRegisterDialogOpen}
        onOpenChange={setIsRegisterDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Register Your @username
            </DialogTitle>
            <DialogDescription>
              Choose a unique username to receive stealth payments. This costs{" "}
              {registrationFee} MATIC.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Username</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  @
                </span>
                <Input
                  placeholder="your_username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value.toLowerCase())}
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                3-20 characters: lowercase letters, numbers, and underscores
                only
              </p>
            </div>

            <div className="p-3 bg-secondary/50 rounded-lg border border-border/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Registration Fee</span>
                <span className="font-medium">{registrationFee} MATIC</span>
              </div>
            </div>

            <GradientButton
              className="w-full"
              onClick={handleRegisterUsername}
              disabled={!newUsername || isPending || isConfirming}
            >
              {isPending || isConfirming ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isConfirming ? "Confirming..." : "Processing..."}
                </span>
              ) : (
                "Register Username"
              )}
            </GradientButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
