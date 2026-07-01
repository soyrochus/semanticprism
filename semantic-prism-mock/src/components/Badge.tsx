import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "blue" | "cyan" | "violet" | "amber" | "green" | "red" | "grey";
}

export function Badge({ children, tone = "grey" }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
