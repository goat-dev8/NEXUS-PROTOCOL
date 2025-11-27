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
        "glass rounded-xl p-6 transition-all duration-200",
        hover && "cursor-pointer hover:shadow-lg hover:shadow-primary/20",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
