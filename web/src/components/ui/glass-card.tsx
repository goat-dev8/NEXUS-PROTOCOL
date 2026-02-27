import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const GlassCard = ({ children, className, hover = false, onClick }: GlassCardProps) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        "rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-200",
        hover && "cursor-pointer hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/10",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
