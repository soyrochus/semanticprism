import type { ReactNode } from "react";

interface StatusChipProps {
  children: ReactNode;
  tone?: "neutral" | "active" | "warning" | "success" | "danger";
}

export function StatusChip({ children, tone = "neutral" }: StatusChipProps) {
  return <span className={`status-chip status-${tone}`}>{children}</span>;
}
