import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "primary",
  className,
}: {
  children: React.ReactNode;
  tone?: "primary" | "accent" | "gold" | "gray" | "red" | "green";
  className?: string;
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent-dark",
    gold: "bg-gold/15 text-amber-700",
    gray: "bg-gray-100 text-gray-600",
    red: "bg-red-100 text-red-700",
    green: "bg-brand-soft text-primary",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
