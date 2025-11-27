import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { Input } from "@/components/ui/input";
import { mockVaults } from "@/lib/mock-data";
import { RISK_LEVELS, VAULT_CATEGORIES } from "@/lib/constants";
import { Search, Shield, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Vaults() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVaults = mockVaults.filter((vault) => {
    const matchesCategory = selectedCategory === "All" || 
      (selectedCategory === "Stablecoin" && (vault.asset === "USDC" || vault.asset === "USDT")) ||
      (selectedCategory === "Blue Chip" && (vault.asset === "ETH" || vault.asset === "WBTC")) ||
      (selectedCategory === "High Yield" && vault.apy > 20);
    
    const matchesSearch = vault.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vault.asset.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const featuredVault = mockVaults[0];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="gradient-text">Privacy Vaults</span>
        </h1>
        <p className="text-muted-foreground">Earn yields while maintaining complete privacy</p>
      </motion.div>

      {/* Featured Vault */}
      <GlassCard className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <div>
            <BadgeCustom className="mb-2">Featured</BadgeCustom>
            <h2 className="text-2xl font-bold mb-2">{featuredVault.name}</h2>
            <p className="text-muted-foreground">{featuredVault.description}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-success mb-1">{featuredVault.apy}%</p>
            <p className="text-sm text-muted-foreground">APY</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">TVL</p>
            <p className="font-semibold">${(featuredVault.tvl / 1000000).toFixed(2)}M</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
            <BadgeCustom variant={featuredVault.risk === "LOW" ? "success" : "warning"}>
              {RISK_LEVELS[featuredVault.risk].label}
            </BadgeCustom>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Privacy</p>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Shield
                  key={i}
                  className={`h-4 w-4 ${i < featuredVault.privacyLevel ? "text-primary" : "text-muted-foreground/30"}`}
                />
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Yield Sources</p>
            <p className="text-sm">{featuredVault.yieldSources.join(", ")}</p>
          </div>
        </div>
        <GradientButton className="w-full">
          Deposit to {featuredVault.asset}
        </GradientButton>
      </GlassCard>

      {/* Filters */}
      <GlassCard>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {VAULT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vaults..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </GlassCard>

      {/* Vault Cards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVaults.map((vault, index) => (
          <motion.div
            key={vault.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard hover className="h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{vault.name}</h3>
                  <p className="text-sm text-muted-foreground">{vault.asset}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-success">{vault.apy}%</p>
                  <p className="text-xs text-muted-foreground">APY</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 flex-1">
                {vault.description}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">TVL</span>
                  <span className="font-medium">${(vault.tvl / 1000000).toFixed(2)}M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <BadgeCustom variant={
                    vault.risk === "LOW" ? "success" : 
                    vault.risk === "MEDIUM" ? "warning" : "danger"
                  }>
                    {RISK_LEVELS[vault.risk].label}
                  </BadgeCustom>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Privacy</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Shield
                        key={i}
                        className={`h-3 w-3 ${i < vault.privacyLevel ? "text-primary" : "text-muted-foreground/30"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <GradientButton className="w-full">
                Deposit
              </GradientButton>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
