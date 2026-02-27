import { Shield, User, Calendar, Activity, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function Identity() {
  const verificationBadges = [
    { label: "Humanity", description: "Prove you are a unique human", verified: true, icon: User },
    { label: "Age (18+)", description: "Prove you meet age requirements", verified: true, icon: Calendar },
    { label: "Wallet Age", description: "Wallet active for 6+ months", verified: true, icon: Activity },
    { label: "KYC-Free", description: "No KYC data stored on-chain", verified: false, icon: Shield },
    { label: "Sybil-Resistant", description: "Single identity per person", verified: false, icon: User },
    { label: "DAO Contributor", description: "Active governance participation", verified: false, icon: CheckCircle2 },
  ];

  const verifyOptions = [
    {
      title: "Prove Humanity",
      description: "Generate a proof that you are a unique human without revealing your identity. Uses attestation-based verification.",
      action: "Generate Proof",
    },
    {
      title: "Prove Age (18+)",
      description: "Prove you meet minimum age requirements without revealing your date of birth or any personal information.",
      action: "Verify Age",
    },
    {
      title: "Wallet History",
      description: "Prove your wallet has been active for a minimum period. This is a public on-chain check, not a privacy-preserving proof.",
      action: "Check History",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Shield className="h-6 w-6 text-emerald-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Identity</span>
          </h1>
        </div>
        <p className="text-white/40 text-sm">Manage your verification badges and on-chain identity.</p>
      </motion.div>

      {/* Status Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-white/40 mb-1">Verification Status</p>
            <p className="text-xl font-bold text-white">Partially Verified</p>
            <p className="text-xs text-white/30 mt-1">3 of 6 badges earned</p>
          </div>
          <div className="flex gap-1">
            {verificationBadges.map((b, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${b.verified ? "bg-emerald-400" : "bg-white/10"}`} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Badges Grid */}
      <div>
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Verification Badges</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {verificationBadges.map((badge, index) => (
            <motion.div key={badge.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-2xl border transition-colors ${
                badge.verified
                  ? "border-emerald-500/20 bg-emerald-500/[0.04]"
                  : "border-white/5 bg-white/[0.02]"
              }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl ${badge.verified ? "bg-emerald-500/10" : "bg-white/[0.04]"}`}>
                  <badge.icon className={`h-5 w-5 ${badge.verified ? "text-emerald-400" : "text-white/30"}`} />
                </div>
                {badge.verified ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 ml-auto" />
                ) : (
                  <div className="ml-auto px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/30 bg-white/[0.04] rounded-full border border-white/5">
                    Unverified
                  </div>
                )}
              </div>
              <h3 className="text-sm font-semibold text-white">{badge.label}</h3>
              <p className="text-xs text-white/40 mt-1">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Verification Actions */}
      <div>
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Verify Your Identity</h2>
        <div className="space-y-4">
          {verifyOptions.map((option, index) => (
            <motion.div key={option.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
              className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/20 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-white font-semibold mb-1">{option.title}</h3>
                  <p className="text-xs text-white/40">{option.description}</p>
                </div>
                <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors">
                  {option.action}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Privacy Note */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/[0.04]">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-400 mb-1">Privacy Note</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Identity proofs use attestation-based verification. While proof generation happens locally, the resulting
              on-chain attestation is public. "Prove Humanity" and "Prove Age" rely on third-party attestors — we do not
              independently verify claims. Wallet History is a fully public on-chain check, not a privacy-preserving proof.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
