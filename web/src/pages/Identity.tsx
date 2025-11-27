import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { Shield, User, Calendar, Activity, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Identity() {
  const verifications = [
    {
      title: "Prove Humanity",
      description: "Verify you're human without revealing identity",
      icon: <User className="h-6 w-6" />,
      status: "verified",
      whatItProves: "Human verification",
      staysPrivate: "Name, location, biometric data",
    },
    {
      title: "Prove Age (18+)",
      description: "Age verification for regulated vaults",
      icon: <Calendar className="h-6 w-6" />,
      status: "unverified",
      whatItProves: "Age over 18",
      staysPrivate: "Exact birthdate, government ID",
    },
    {
      title: "Prove Wallet History",
      description: "Prove on-chain history without exposing transactions",
      icon: <Activity className="h-6 w-6" />,
      status: "unverified",
      whatItProves: "Wallet age, transaction volume",
      staysPrivate: "Individual transactions, addresses",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">ZK Identity</span>
          </h1>
        </div>
        <p className="text-muted-foreground">Verify once, stay private forever</p>
      </motion.div>

      {/* Identity Status */}
      <GlassCard className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Identity Status</p>
            <p className="text-2xl font-bold mb-2">Partially Verified</p>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Shield
                    key={i}
                    className={`h-4 w-4 ${i < 2 ? "text-primary" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Privacy Score: 2/5</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <BadgeCustom variant="success">1 Verified</BadgeCustom>
            <BadgeCustom variant="warning">2 Pending</BadgeCustom>
          </div>
        </div>
      </GlassCard>

      {/* Verification Badges */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Verification Badges</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {["Humanity", "Age 18+", "Wallet History", "DeFi Expert", "Early Adopter", "High Volume"].map((badge, index) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-3 ${
                  index === 0 ? "bg-primary/20 text-primary" : "bg-secondary"
                }`}>
                  {index === 0 ? <CheckCircle2 className="h-8 w-8" /> : <Shield className="h-8 w-8 opacity-30" />}
                </div>
                <h3 className="font-semibold">{badge}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {index === 0 ? "Verified" : "Not yet earned"}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Verification Options */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Available Verifications</h2>
        <div className="space-y-4">
          {verifications.map((verification, index) => (
            <motion.div
              key={verification.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    {verification.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{verification.title}</h3>
                      {verification.status === "verified" ? (
                        <BadgeCustom variant="success">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Verified
                        </BadgeCustom>
                      ) : (
                        <BadgeCustom variant="warning">Not Verified</BadgeCustom>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{verification.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-secondary/50 rounded-lg border border-border/50">
                        <p className="text-sm font-medium text-success mb-1">What it proves:</p>
                        <p className="text-sm text-muted-foreground">{verification.whatItProves}</p>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg border border-border/50">
                        <p className="text-sm font-medium text-primary mb-1">Stays private:</p>
                        <p className="text-sm text-muted-foreground">{verification.staysPrivate}</p>
                      </div>
                    </div>

                    {verification.status === "verified" ? (
                      <button className="px-4 py-2 bg-success/10 text-success rounded-lg font-medium cursor-not-allowed">
                        <CheckCircle2 className="h-4 w-4 inline mr-2" />
                        Already Verified
                      </button>
                    ) : (
                      <GradientButton>
                        <Shield className="h-4 w-4 mr-2" />
                        Generate ZK Proof
                      </GradientButton>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Privacy Notice */}
      <GlassCard className="border-primary/20">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold mb-2">How ZK Identity Works</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Zero-knowledge proofs allow you to prove statements about your identity or history without revealing the actual data. 
              All verifications happen locally on your device, and only cryptographic proofs are submitted on-chain.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Your personal data never leaves your device</li>
              <li>• Proofs are mathematically verifiable without revealing information</li>
              <li>• Compatible with major identity providers and attestation services</li>
              <li>• One-time verification, lifetime privacy</li>
            </ul>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
