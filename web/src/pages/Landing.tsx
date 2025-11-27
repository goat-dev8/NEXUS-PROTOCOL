import { GradientButton } from "@/components/ui/gradient-button";
import { OutlineButton } from "@/components/ui/outline-button";
import { GlassCard } from "@/components/ui/glass-card";
import { Footer } from "@/components/layout/Footer";
import { Shield, Lock, Ghost, Brain, TrendingUp, Vault, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { SUPPORTED_PROTOCOLS } from "@/lib/constants";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Lock className="h-8 w-8" />,
      title: "ZK-Shielded Vaults",
      description: "Provide liquidity anonymously with zero-knowledge proofs. Your funds, your privacy.",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "NEXUS AI Agent",
      description: "Autonomous AI optimizes your yields 24/7 across multiple protocols.",
    },
    {
      icon: <Ghost className="h-8 w-8" />,
      title: "Stealth Payments",
      description: "Send funds via @username without revealing your wallet address.",
    },
  ];

  const steps = [
    { icon: <Shield className="h-6 w-6" />, title: "Connect Wallet" },
    { icon: <Lock className="h-6 w-6" />, title: "Verify Identity (ZK)" },
    { icon: <Vault className="h-6 w-6" />, title: "Deposit to Vaults" },
    { icon: <TrendingUp className="h-6 w-6" />, title: "Earn Optimized Yields" },
  ];

  const stats = [
    { label: "Total Value Locked", value: "$8.42M" },
    { label: "Active Users", value: "12,450+" },
    { label: "APY Up To", value: "28.9%" },
    { label: "AI Optimizations/Day", value: "1,247" },
  ];

  const security = [
    { icon: <Shield className="h-5 w-5" />, text: "Audited & Secure" },
    { icon: <Lock className="h-5 w-5" />, text: "ZK-Powered Privacy" },
    { icon: <Zap className="h-5 w-5" />, text: "Non-Custodial" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-40 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container relative mx-auto px-4 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <Shield className="h-16 w-16 text-primary mx-auto animate-float" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">The Invisible Yield Layer</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Privacy-First AI Yield Aggregator on Polygon. Your Yield. Your Privacy. Your Sovereignty.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <GradientButton size="lg" onClick={() => navigate("/app")}>
                Launch App
              </GradientButton>
              <OutlineButton size="lg">
                Read Docs
              </OutlineButton>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <GlassCard className="text-center">
                    <p className="text-2xl md:text-3xl font-bold text-primary mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Built for privacy, optimized by AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard hover className="h-full">
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">How It Works</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 border border-primary/20">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-lg">{step.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Protocols */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Aggregating the Best Yields Across DeFi
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 items-center">
            {SUPPORTED_PROTOCOLS.map((protocol, index) => (
              <motion.div
                key={protocol.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary mb-2">
                  <protocol.icon className="h-8 w-8" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">{protocol.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <GlassCard className="max-w-4xl mx-auto">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Security First
              </h2>
              <div className="flex flex-wrap justify-center gap-8">
                {security.map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 text-primary"
                  >
                    {item.icon}
                    <span className="font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Ready to Earn Private Yields?</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users earning optimized yields with complete privacy
            </p>
            <GradientButton size="lg" onClick={() => navigate("/app")} className="glow-purple">
              Launch App Now
            </GradientButton>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
