import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GradientButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const GradientButton = ({ 
  children, 
  className, 
  size = "md",
  ...props 
}: GradientButtonProps) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-full",
        "transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/30",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
