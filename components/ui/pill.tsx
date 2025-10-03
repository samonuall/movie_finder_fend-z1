import { cn } from "@/lib/utils";

interface PillProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "dark" | "light";
  isLoading?: boolean;
  loadingText?: string;
}

export function Pill({
  children,
  className,
  variant = "default",
  isLoading = false,
  loadingText = "Loading...",
}: PillProps) {
  const variantStyles = {
    default: "bg-white/90 backdrop-blur-sm shadow-lg",
    dark: "bg-gray-900/90 backdrop-blur-sm shadow-lg text-white",
    light: "bg-white backdrop-blur-sm shadow-md",
  };

  return (
    <div
      className={cn(
        "rounded-full px-6 py-3",
        variantStyles[variant],
        className,
      )}
    >
      {isLoading ? (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "animate-spin rounded-full h-5 w-5 border-b-2",
              variant === "dark" ? "border-white" : "border-gray-900",
            )}
          />
          <p
            className={cn(
              "text-sm",
              variant === "dark" ? "text-gray-200" : "text-gray-600",
            )}
          >
            {loadingText}
          </p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
