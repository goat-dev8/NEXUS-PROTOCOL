import { mockProposals } from "@/lib/mock-data";
import { Vote, Clock, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Governance() {
  const votingPower = "2,450 NXS";

  const getTimeRemaining = (endDate: Date) => {
    const end = endDate.getTime();
    const now = Date.now();
    const diff = end - now;
    if (diff <= 0) return "Ended";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h remaining`;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Vote className="h-6 w-6 text-emerald-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Governance</span>
          </h1>
        </div>
        <p className="text-white/40 text-sm">Vote on protocol proposals and shape the future of Nexus.</p>
      </motion.div>

      {/* Voting Power */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-white/40 mb-1">Your Voting Power</p>
            <p className="text-3xl font-bold text-white">{votingPower}</p>
            <p className="text-xs text-white/30 mt-1">Based on staked NXS tokens</p>
          </div>
          <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors">
            Delegate Votes
          </button>
        </div>
      </motion.div>

      {/* Active Proposals */}
      <div>
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Active Proposals</h2>
        <div className="space-y-4">
          {mockProposals
            .filter((p) => p.status.toLowerCase() === "active")
            .map((proposal, index) => {
              const total = proposal.votesFor + proposal.votesAgainst + (proposal.votesAbstain || 0);
              const forPct = total > 0 ? ((proposal.votesFor / total) * 100).toFixed(1) : "0";
              const againstPct = total > 0 ? ((proposal.votesAgainst / total) * 100).toFixed(1) : "0";
              const abstainPct = total > 0 ? (((proposal.votesAbstain || 0) / total) * 100).toFixed(1) : "0";

              return (
                <motion.div key={proposal.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                  className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/20 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                          Active
                        </span>
                        <span className="text-[10px] text-white/30 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getTimeRemaining(proposal.deadline)}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold">{proposal.title}</h3>
                      <p className="text-xs text-white/40 mt-1">{proposal.description}</p>
                    </div>
                  </div>

                  {/* Vote Bars */}
                  <div className="space-y-2 mb-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> For
                        </span>
                        <span className="text-white/60">{forPct}% ({proposal.votesFor.toLocaleString()})</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${forPct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-red-400 font-medium flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> Against
                        </span>
                        <span className="text-white/60">{againstPct}% ({proposal.votesAgainst.toLocaleString()})</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${againstPct}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/40 font-medium">Abstain</span>
                        <span className="text-white/60">{abstainPct}% ({(proposal.votesAbstain || 0).toLocaleString()})</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-white/20 rounded-full" style={{ width: `${abstainPct}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors">
                      Vote For
                    </button>
                    <button className="flex-1 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-white/60 text-sm font-medium rounded-full border border-white/10 transition-colors">
                      Vote Against
                    </button>
                    <button className="py-2 px-4 bg-white/[0.04] hover:bg-white/[0.08] text-white/40 text-sm font-medium rounded-full border border-white/10 transition-colors">
                      Abstain
                    </button>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Past Proposals */}
      <div>
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Past Proposals</h2>
        <div className="space-y-3">
          {mockProposals
            .filter((p) => p.status.toLowerCase() !== "active")
            .map((proposal, index) => {
              const total = proposal.votesFor + proposal.votesAgainst;
              const forPct = total > 0 ? ((proposal.votesFor / total) * 100).toFixed(1) : "0";

              return (
                <motion.div key={proposal.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                          proposal.status === "passed"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {proposal.status}
                        </span>
                        <h3 className="text-sm text-white/80">{proposal.title}</h3>
                      </div>
                    </div>
                    <span className="text-xs text-white/40">{forPct}% approval</span>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
