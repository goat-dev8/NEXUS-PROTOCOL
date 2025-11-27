import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Shield, Bell, Network, Eye, Palette } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const sections = [
    {
      title: "Profile",
      icon: <User className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label>Username</Label>
            <Input defaultValue="@nexus_user" className="mt-1" />
          </div>
          <div>
            <Label>Display Name</Label>
            <Input defaultValue="Nexus User" className="mt-1" />
          </div>
          <div>
            <Label>Email (Optional)</Label>
            <Input type="email" placeholder="your@email.com" className="mt-1" />
          </div>
          <GradientButton>Save Profile</GradientButton>
        </div>
      ),
    },
    {
      title: "Security",
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Require Confirmation for Withdrawals</Label>
              <p className="text-sm text-muted-foreground">Confirm every withdrawal action</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="pt-4 border-t border-border/50">
            <Label className="mb-2 block">Active Sessions</Label>
            <div className="space-y-2">
              <div className="p-3 bg-secondary/50 rounded-lg border border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Current Device</p>
                    <p className="text-xs text-muted-foreground">Last active: Now</p>
                  </div>
                  <span className="text-xs text-success">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Transaction Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified of all transactions</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Yield Optimization Alerts</Label>
              <p className="text-sm text-muted-foreground">AI recommendations and updates</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Governance Proposals</Label>
              <p className="text-sm text-muted-foreground">New proposals and voting reminders</p>
            </div>
            <Switch />
          </div>
        </div>
      ),
    },
    {
      title: "Network",
      icon: <Network className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label>RPC Endpoint</Label>
            <Input defaultValue="https://polygon-rpc.com" className="mt-1" />
          </div>
          <div>
            <Label>Gas Price Preference</Label>
            <select className="w-full mt-1 bg-secondary border border-border rounded-lg px-3 py-2">
              <option>Standard</option>
              <option>Fast</option>
              <option>Instant</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-approve Low Gas Transactions</Label>
              <p className="text-sm text-muted-foreground">Skip confirmation for gas {"<"} $1</p>
            </div>
            <Switch />
          </div>
          <GradientButton>Save Network Settings</GradientButton>
        </div>
      ),
    },
    {
      title: "Privacy",
      icon: <Eye className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Hide Balance by Default</Label>
              <p className="text-sm text-muted-foreground">Obscure balances on dashboard</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Anonymous Analytics</Label>
              <p className="text-sm text-muted-foreground">Help improve the protocol</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Share Transaction Data with AI</Label>
              <p className="text-sm text-muted-foreground">Allow AI to optimize based on your history</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      ),
    },
    {
      title: "Theme",
      icon: <Palette className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Appearance</Label>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors border border-border">
                <span className="font-medium">Dark</span>
              </button>
              <button className="p-4 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors border border-border opacity-50">
                <span className="font-medium">Light (Coming Soon)</span>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Reduce Motion</Label>
              <p className="text-sm text-muted-foreground">Minimize animations</p>
            </div>
            <Switch />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </motion.div>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                <div className="text-primary">{section.icon}</div>
                <h2 className="text-xl font-bold">{section.title}</h2>
              </div>
              {section.content}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
