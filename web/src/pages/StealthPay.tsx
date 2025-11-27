import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { Label } from "@/components/ui/label";
import { mockStealthTransactions } from "@/lib/mock-data";
import { Ghost, Copy, QrCode, ArrowUpRight, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function StealthPay() {
  const { toast } = useToast();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedTab, setSelectedTab] = useState<"sent" | "received" | "all">("all");

  const stealthAddress = "stealth:0x7f8a...3c2d";

  const handleCopy = () => {
    navigator.clipboard.writeText(stealthAddress);
    toast({
      title: "Copied!",
      description: "Stealth address copied to clipboard",
    });
  };

  const filteredTransactions = mockStealthTransactions.filter((tx) => {
    if (selectedTab === "all") return true;
    return tx.type.toLowerCase() === selectedTab;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Ghost className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">Stealth Payments</span>
          </h1>
        </div>
        <p className="text-muted-foreground">Send funds privately using @usernames</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Send Card */}
        <GlassCard>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Ghost className="h-5 w-5 text-primary" />
            Send Privately
          </h2>
          <div className="space-y-4">
            <div>
              <Label>Recipient (@username or 0x address)</Label>
              <Input
                placeholder="@alice or 0x742d..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Asset</Label>
              <select className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2">
                <option>USDC</option>
                <option>USDT</option>
                <option>MATIC</option>
                <option>ETH</option>
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
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-sm font-medium">
                  MAX
                </button>
              </div>
            </div>

            <div>
              <Label>Note (Optional, Encrypted)</Label>
              <Input
                placeholder="Add a private note..."
                className="mt-1"
              />
            </div>

            <div className="p-3 bg-secondary/50 rounded-lg border border-border/50">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Estimated Fee</span>
                <span className="font-medium">0.02 MATIC</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-primary">
                <Shield className="h-3 w-3" />
                <span>ZK-Shielded Transaction</span>
              </div>
            </div>

            <GradientButton className="w-full">
              <Ghost className="h-4 w-4 mr-2" />
              Send Privately
            </GradientButton>
          </div>
        </GlassCard>

        {/* Receive Card */}
        <GlassCard>
          <h2 className="text-xl font-bold mb-4">Receive</h2>
          <div className="space-y-4">
            <div>
              <Label>Your Stealth Address</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={stealthAddress}
                  readOnly
                  className="flex-1"
                />
                <button
                  onClick={handleCopy}
                  className="p-2 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div>
              <Label>Your @username</Label>
              <Input
                value="@nexus_user"
                readOnly
                className="mt-1"
              />
            </div>

            <div className="flex flex-col items-center justify-center py-8 bg-secondary/50 rounded-lg border border-border/50">
              <QrCode className="h-32 w-32 text-primary mb-3" />
              <p className="text-sm text-muted-foreground">
                Scan to receive stealth payment
              </p>
            </div>

            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-sm">
                <strong>Privacy Note:</strong> Stealth addresses are generated for each transaction, keeping your main address private.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">To/From</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Privacy</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Tx</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, index) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/30 hover:bg-secondary/30"
                >
                  <td className="py-3 px-2">
                    <BadgeCustom variant={tx.type === "Sent" ? "warning" : "success"}>
                      {tx.type}
                    </BadgeCustom>
                  </td>
                  <td className="py-3 px-2 text-sm">{tx.toFrom}</td>
                  <td className="py-3 px-2 text-sm font-medium">
                    {tx.amount} {tx.asset}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Shield
                          key={i}
                          className={`h-3 w-3 ${i < tx.privacyLevel ? "text-primary" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <BadgeCustom variant="success">
                      {tx.status}
                    </BadgeCustom>
                  </td>
                  <td className="py-3 px-2">
                    <a 
                      href="#" 
                      className="text-primary text-sm flex items-center gap-1 hover:underline"
                    >
                      {tx.txHash.slice(0, 12)}...
                      <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
