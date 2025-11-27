import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { OutlineButton } from "@/components/ui/outline-button";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { mockProposals } from "@/lib/mock-data";
import { Vote, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Governance() {
  const votingPower = 2500;

  const getTimeRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days remaining`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Vote className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">NEXUS DAO</span>
          </h1>
        </div>
        <p className="text-muted-foreground">Shape the future of the protocol</p>
      </motion.div>

      {/* Voting Power */}
      <GlassCard className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Your Voting Power</p>
            <p className="text-3xl font-bold text-primary">{votingPower.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">NEXUS Tokens</p>
          </div>
          <Vote className="h-16 w-16 text-primary opacity-50" />
        </div>
      </GlassCard>

      {/* Active Proposals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Active Proposals</h2>
          <GradientButton size="sm">
            Create Proposal
          </GradientButton>
        </div>

        <div className="space-y-4">
          {mockProposals.map((proposal, index) => {
            const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
            const forPercentage = (proposal.votesFor / totalVotes * 100).toFixed(1);
            const againstPercentage = (proposal.votesAgainst / totalVotes * 100).toFixed(1);
            const abstainPercentage = (proposal.votesAbstain / totalVotes * 100).toFixed(1);

            return (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{proposal.title}</h3>
                        <BadgeCustom variant="success">{proposal.status}</BadgeCustom>
                      </div>
                      <p className="text-muted-foreground">{proposal.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {/* For Votes */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-success font-medium">For ({forPercentage}%)</span>
                        <span className="text-muted-foreground">
                          {(proposal.votesFor / 1000000).toFixed(2)}M votes
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${forPercentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          className="h-full bg-success"
                        />
                      </div>
                    </div>

                    {/* Against Votes */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-destructive font-medium">Against ({againstPercentage}%)</span>
                        <span className="text-muted-foreground">
                          {(proposal.votesAgainst / 1000000).toFixed(2)}M votes
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${againstPercentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
                          className="h-full bg-destructive"
                        />
                      </div>
                    </div>

                    {/* Abstain Votes */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground font-medium">Abstain ({abstainPercentage}%)</span>
                        <span className="text-muted-foreground">
                          {(proposal.votesAbstain / 1000000).toFixed(2)}M votes
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${abstainPercentage}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                          className="h-full bg-muted"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{getTimeRemaining(proposal.deadline)}</span>
                    </div>
                    <div className="flex gap-2">
                      <OutlineButton size="sm">View Details</OutlineButton>
                      <GradientButton size="sm">
                        <Vote className="h-4 w-4 mr-2" />
                        Vote
                      </GradientButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Past Proposals */}
      <GlassCard>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          Past Proposals
        </h2>
        <p className="text-muted-foreground text-center py-8">
          No past proposals yet. Check back soon!
        </p>
      </GlassCard>
    </div>
  );
}
