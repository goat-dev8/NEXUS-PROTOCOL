import { Vote, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Governance() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Vote className="h-6 w-6 text-emerald-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Governance</span>
          </h1>
        </div>
        <p className="text-white/40 text-sm">On-chain governance for Nexus Protocol.</p>
      </motion.div>

      {/* Coming Soon Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="p-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04]">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Clock className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
          <p className="text-white/40 text-sm max-w-md">
            The Nexus Governance contract is currently in development. Once deployed on Polygon, 
            NXS token holders will be able to create proposals, vote on protocol changes, and 
            delegate voting power — all fully on-chain.
          </p>
        </div>
      </motion.div>

      {/* Roadmap */}
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Governance Roadmap</h2>
        <div className="space-y-4">
          {[
            {
              title: "NXS Token Launch",
              description: "Deploy NXS governance token on Polygon with fair distribution to protocol users",
              status: "planned" as const,
            },
            {
              title: "Governor Contract Deployment",
              description: "Deploy OpenZeppelin Governor with timelock for secure on-chain governance",
              status: "planned" as const,
            },
            {
              title: "Proposal System",
              description: "Enable NXS holders to create and vote on protocol improvement proposals",
              status: "planned" as const,
            },
            {
              title: "Fee & Parameter Governance",
              description: "Community control over vault fees, risk parameters, and protocol upgrades",
              status: "planned" as const,
            },
          ].map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400/50" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-white">{item.title}</h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/5 text-white/30 rounded-full border border-white/10">
                      Planned
                    </span>
                  </div>
                  <p className="text-xs text-white/40">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Current Deployed Contracts */}
      <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400" />
          Currently Deployed (Polygon)
        </h2>
        <div className="space-y-2">
          {[
            { name: "NexusFactory", status: "Live" },
            { name: "USDC Yield Vault", status: "Live" },
            { name: "USDT Yield Vault", status: "Live" },
            { name: "DAI Yield Vault", status: "Live" },
            { name: "StealthRegistry", status: "Live" },
            { name: "NexusPrivacyPool", status: "Pending" },
            { name: "NexusGovernor", status: "Planned" },
          ].map((contract) => (
            <div key={contract.name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
              <span className="text-sm text-white/60">{contract.name}</span>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                contract.status === "Live"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : contract.status === "Pending"
                  ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  : "bg-white/5 text-white/30 border-white/10"
              }`}>
                {contract.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
