import { NavLink } from "@/components/NavLink";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Vault, 
  Ghost, 
  Brain, 
  PieChart, 
  Vote, 
  Settings,
  Shield,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { to: "/app", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/vaults", icon: Vault, label: "Vaults" },
  { to: "/app/stealth", icon: Ghost, label: "Stealth Pay" },
  { to: "/app/ai", icon: Brain, label: "AI Agent" },
  { to: "/app/portfolio", icon: PieChart, label: "Portfolio" },
  { to: "/app/governance", icon: Vote, label: "Governance" },
  { to: "/app/identity", icon: Shield, label: "ZK Identity" },
  { to: "/app/settings", icon: Settings, label: "Settings" },
];

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarCollapsed ? "-100%" : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 z-50",
          "glass border-r border-border/50 lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* Close button for mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <nav className="flex-1 space-y-2 mt-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/app"}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg",
                  "text-muted-foreground transition-all duration-200",
                  "hover:bg-secondary hover:text-foreground"
                )}
                activeClassName="bg-primary/10 text-primary font-medium border border-primary/20"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-border/50 pt-4 mt-4">
            <div className="px-4 py-2">
              <p className="text-xs text-muted-foreground">Nexus Protocol v1.0</p>
              <p className="text-xs text-muted-foreground mt-1">Built on Polygon</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
