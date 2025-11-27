import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface OutlineButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const OutlineButton = ({ 
  children, 
  className, 
  size = "md",
  ...props 
}: OutlineButtonProps) => {
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
        "border-2 border-primary text-primary font-semibold rounded-lg bg-transparent",
        "transition-all duration-200 hover:bg-primary hover:text-primary-foreground",
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
