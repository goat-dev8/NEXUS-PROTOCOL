import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Shield, Bell, Network, Eye, Palette } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const [rpcEndpoint, setRpcEndpoint] = useState("https://polygon-rpc.com");
  const [darkMode, setDarkMode] = useState(true);

  const sections = [
    {
      icon: User,
      title: "Profile",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-white/60 text-xs mb-2 block">Display Name</Label>
            <Input placeholder="Anonymous" className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/30" />
          </div>
          <div>
            <Label className="text-white/60 text-xs mb-2 block">Username</Label>
            <Input placeholder="@nexususer" className="bg-white/[0.04] border-white/10 text-white placeholder:text-white/30" />
          </div>
        </div>
      ),
    },
    {
      icon: Shield,
      title: "Security",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Two-Factor Authentication</p>
              <p className="text-xs text-white/30">Add an extra layer of security</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Transaction Signing</p>
              <p className="text-xs text-white/30">Require confirmation for all transactions</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      ),
    },
    {
      icon: Bell,
      title: "Notifications",
      content: (
        <div className="space-y-4">
          {[
            { label: "Deposit Confirmations", desc: "When deposits are confirmed on-chain", default: true },
            { label: "Yield Updates", desc: "Daily yield and earnings summary", default: true },
            { label: "Governance Proposals", desc: "New proposals and voting reminders", default: false },
            { label: "Privacy Pool Alerts", desc: "Anonymity set milestones", default: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">{item.label}</p>
                <p className="text-xs text-white/30">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.default} />
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: Network,
      title: "Network",
      content: (
        <div className="space-y-4">
          <div>
            <Label className="text-white/60 text-xs mb-2 block">RPC Endpoint</Label>
            <Input value={rpcEndpoint} onChange={(e) => setRpcEndpoint(e.target.value)}
              className="bg-white/[0.04] border-white/10 text-white font-mono text-xs placeholder:text-white/30" />
            <p className="text-[10px] text-white/30 mt-1">Custom RPC endpoint for Polygon network</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Testnet Mode</p>
              <p className="text-xs text-white/30">Use Polygon Amoy testnet</p>
            </div>
            <Switch />
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Connected Network</span>
              <span className="text-xs font-medium text-emerald-400">Polygon Mainnet</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-white/40">Chain ID</span>
              <span className="text-xs font-mono text-white/60">137</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: Eye,
      title: "Privacy",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Hide Balances</p>
              <p className="text-xs text-white/30">Mask balance values in the UI</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Private Transactions</p>
              <p className="text-xs text-white/30">Route through Privacy Pool when possible</p>
            </div>
            <Switch />
          </div>
          <div className="p-3 rounded-xl bg-yellow-500/[0.04] border border-yellow-500/20">
            <p className="text-xs text-yellow-400/80">
              Note: Vault deposits and withdrawals are always visible on-chain. The Privacy Pool reduces correlation between
              deposit and withdrawal addresses but does not hide amounts (fixed denominations are used).
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: Palette,
      title: "Theme",
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">Dark Mode</p>
              <p className="text-xs text-white/30">Use dark theme throughout the app</p>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
          <div>
            <Label className="text-white/60 text-xs mb-2 block">Accent Color</Label>
            <div className="flex gap-2">
              {["bg-emerald-500", "bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"].map((color, i) => (
                <button key={color}
                  className={`w-8 h-8 rounded-full ${color} ${i === 0 ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a]" : "opacity-50 hover:opacity-100"} transition-opacity`} />
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Settings</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">Manage your account preferences and protocol configuration.</p>
      </motion.div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
            className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <section.icon className="h-4 w-4 text-emerald-400" />
              </div>
              <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">{section.title}</h2>
            </div>
            {section.content}
          </motion.div>
        ))}
      </div>

      <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-colors">
        Save All Settings
      </button>
    </div>
  );
}
