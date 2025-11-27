import { cn } from "@/lib/utils";

interface BadgeCustomProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export const BadgeCustom = ({ children, variant = "default", className }: BadgeCustomProps) => {
  const variants = {
    default: "bg-secondary text-secondary-foreground",
    success: "bg-success/10 text-success border border-success/20",
    warning: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
    danger: "bg-destructive/10 text-destructive border border-destructive/20",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
