import { GlassCard } from "./glass-card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  className?: string;
}

export const StatCard = ({ label, value, icon, trend, className }: StatCardProps) => {
  return (
    <GlassCard hover className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      <motion.p 
        className="text-2xl md:text-3xl font-bold text-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {value}
      </motion.p>
      {trend !== undefined && (
        <div className={cn(
          "text-sm font-medium flex items-center gap-1",
          trend >= 0 ? "text-success" : "text-destructive"
        )}>
          <span>{trend >= 0 ? "↑" : "↓"}</span>
          <span>{Math.abs(trend)}%</span>
        </div>
      )}
    </GlassCard>
  );
};
