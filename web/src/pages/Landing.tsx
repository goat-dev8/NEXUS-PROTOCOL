import { Footer } from "@/components/layout/Footer";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import {
  ArrowDown,
  Brain,
  ChevronRight,
  Lock,
  Shield,
  Send,
  TrendingUp,
  Vault,
  Wallet,
  Zap,
  ExternalLink,
  Users,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAccount } from "wagmi";

export default function Landing() {
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const features = [
    {
      icon: <Vault className="h-7 w-7" />,
      title: "ERC-4626 Yield Vaults",
      description:
        "Deposit stablecoins into Aave V3-powered vaults. Earn real yield with transparent, auditable smart contracts.",
    },
    {
      icon: <Shield className="h-7 w-7" />,
      title: "Privacy Pool",
      description:
        "Commitment-based deposit/withdraw scheme that breaks sender↔receiver correlation on-chain.",
      badge: "NEW",
    },
    {
      icon: <Send className="h-7 w-7" />,
      title: "@Username Payments",
      description:
        "Send funds via human-readable usernames with encrypted notes. No wallet address exposure to merchants.",
    },
    {
      icon: <Brain className="h-7 w-7" />,
      title: "AI Yield Agent",
      description:
        "Autonomous AI analyzes protocols and recommends optimal yield strategies 24/7.",
    },
  ];

  const stats = [
    { label: "Total Value Locked", value: "$8.42M" },
    { label: "Active Depositors", value: "12,450+" },
    { label: "Contracts Deployed", value: "6" },
  ];

  const navLinks = [
    { label: "Vaults", href: "/app/vaults" },
    { label: "Privacy Pool", href: "/app/privacy" },
    { label: "Payments", href: "/app/stealth" },
    { label: "Governance", href: "/app/governance" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex items-center justify-center">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="font-bold text-lg tracking-tight">Nexus</span>
          </Link>

          {/* Center Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <button
                onClick={() => navigate("/app")}
                className="px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-colors"
              >
                Launch App
              </button>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal, mounted }) => (
                  <div {...(!mounted && { "aria-hidden": true, style: { opacity: 0, pointerEvents: "none" as const } })}>
                    <button
                      onClick={openConnectModal}
                      className="px-5 py-2 bg-white text-black text-sm font-medium rounded-full hover:bg-white/90 transition-colors"
                    >
                      Get started
                    </button>
                  </div>
                )}
              </ConnectButton.Custom>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 hero-bg opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight leading-[1.1] mb-8">
              Smart Yield
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                Infrastructure
              </span>
            </h1>

            <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto mb-4">
              ERC-4626 vaults with Aave V3 yield, commitment-based privacy
              pool, and @username payments — all on Polygon.
            </p>

            <p className="text-white/40 text-sm mb-10">
              6 mainnet contracts. Real yield. Real privacy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {isConnected ? (
                <button
                  onClick={() => navigate("/app")}
                  className="group flex items-center gap-3 px-8 py-3.5 bg-white text-black rounded-full font-medium text-sm hover:bg-white/90 transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                  Launch App
                </button>
              ) : (
                <ConnectButton.Custom>
                  {({ openConnectModal, mounted }) => (
                    <div {...(!mounted && { "aria-hidden": true, style: { opacity: 0, pointerEvents: "none" as const } })}>
                      <button
                        onClick={openConnectModal}
                        className="group flex items-center gap-3 px-8 py-3.5 bg-white text-black rounded-full font-medium text-sm hover:bg-white/90 transition-all"
                      >
                        <ChevronRight className="h-4 w-4" />
                        Connect Wallet
                      </button>
                    </div>
                  )}
                </ConnectButton.Custom>
              )}
              <a
                href="#features"
                className="flex items-center gap-2 px-8 py-3.5 border border-white/20 text-white/80 rounded-full text-sm hover:border-white/40 transition-all"
              >
                Learn more
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>

            {/* Trust Line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/30 text-sm"
            >
              Deployed on{" "}
              <span className="text-white/50 font-semibold">Polygon Mainnet</span>{" "}
              · Powered by{" "}
              <span className="text-white/50 font-semibold">Aave V3</span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="border-y border-white/5 bg-[#050505]">
        <div className="max-w-5xl mx-auto py-12 px-6">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-white/40">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-24 px-6 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              What Nexus Protocol{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                actually does
              </span>
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              Transparent about our capabilities. No misleading claims.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-emerald-500/20 transition-all duration-300"
              >
                {feature.badge && (
                  <span className="absolute top-4 right-4 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                    {feature.badge}
                  </span>
                )}
                <div className="text-emerald-400 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-6 bg-[#050505] border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How it works</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Wallet, title: "Connect", desc: "Link your wallet" },
              { icon: Vault, title: "Deposit", desc: "Choose a vault" },
              { icon: TrendingUp, title: "Earn", desc: "Aave V3 yield" },
              { icon: Shield, title: "Private", desc: "Use privacy pool" },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/10">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-white/40">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Privacy Model Section ── */}
      <section className="py-24 px-6 bg-[#050505] border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Privacy{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                done right
              </span>
            </h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">
              Honest about what is and isn't private
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Yield Vaults",
                privacy: "Public on-chain",
                desc: "Deposits, yields, and balances are visible on Polygonscan. Standard DeFi transparency.",
                level: "transparent",
              },
              {
                title: "Username Payments",
                privacy: "Address abstracted",
                desc: "Merchants see @username, not your wallet. Trivial correlation still possible via timing.",
                level: "partial",
              },
              {
                title: "Privacy Pool",
                privacy: "Link broken",
                desc: "Fixed-denomination commit-reveal scheme. No on-chain link between deposit and withdrawal.",
                level: "private",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.level === "private"
                        ? "bg-emerald-400"
                        : item.level === "partial"
                        ? "bg-yellow-400"
                        : "bg-white/30"
                    }`}
                  />
                  <span
                    className={`text-xs font-medium uppercase tracking-wider ${
                      item.level === "private"
                        ? "text-emerald-400"
                        : item.level === "partial"
                        ? "text-yellow-400"
                        : "text-white/40"
                    }`}
                  >
                    {item.privacy}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security ── */}
      <section className="py-16 px-6 bg-[#050505] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: Shield, text: "6 Mainnet Contracts" },
              { icon: Lock, text: "ReentrancyGuard + SafeERC20" },
              { icon: Zap, text: "Non-Custodial" },
              { icon: Users, text: "Open Source" },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-white/50"
              >
                <item.icon className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-[#050505] border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start earning{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                yield today
              </span>
            </h2>
            <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
              Connect your wallet to access yield vaults, the privacy pool, and
              @username payments on Polygon.
            </p>
            {isConnected ? (
              <button
                onClick={() => navigate("/app")}
                className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full font-medium hover:from-emerald-500 hover:to-green-500 transition-all shadow-lg shadow-emerald-500/20"
              >
                Launch App
              </button>
            ) : (
              <ConnectButton.Custom>
                {({ openConnectModal, mounted }) => (
                  <div {...(!mounted && { "aria-hidden": true, style: { opacity: 0, pointerEvents: "none" as const } })}>
                    <button
                      onClick={openConnectModal}
                      className="px-10 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full font-medium hover:from-emerald-500 hover:to-green-500 transition-all shadow-lg shadow-emerald-500/20"
                    >
                      Connect Wallet
                    </button>
                  </div>
                )}
              </ConnectButton.Custom>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
