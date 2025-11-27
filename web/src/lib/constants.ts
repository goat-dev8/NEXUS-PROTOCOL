import { Hexagon, Swords, Flame, Zap, Ghost } from "lucide-react";

export const SUPPORTED_PROTOCOLS = [
  { name: "Polygon", icon: Hexagon },
  { name: "Katana", icon: Swords },
  { name: "Uniswap", icon: Flame },
  { name: "QuickSwap", icon: Zap },
  { name: "Aave", icon: Ghost },
];

export const RISK_LEVELS = {
  LOW: { label: "Low", color: "text-success", bgColor: "bg-success/10" },
  MEDIUM: { label: "Medium", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  HIGH: { label: "High", color: "text-destructive", bgColor: "bg-destructive/10" },
};

export const VAULT_CATEGORIES = ["All", "Stablecoin", "Blue Chip", "High Yield"];

export const TRANSACTION_STATUS = {
  PENDING: { label: "Pending", color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  COMPLETED: { label: "Completed", color: "text-success", bgColor: "bg-success/10" },
  FAILED: { label: "Failed", color: "text-destructive", bgColor: "bg-destructive/10" },
};
