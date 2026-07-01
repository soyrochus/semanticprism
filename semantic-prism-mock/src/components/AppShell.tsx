import type { ReactNode } from "react";

interface AppShellProps {
  topBar: ReactNode;
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
  bottom: ReactNode;
}

export function AppShell({ topBar, left, center, right, bottom }: AppShellProps) {
  return (
    <div className="workspace-shell">
      <header className="workspace-topbar">{topBar}</header>
      <aside className="workspace-left">{left}</aside>
      <main className="workspace-center">{center}</main>
      <aside className="workspace-right">{right}</aside>
      <section className="workspace-bottom">{bottom}</section>
    </div>
  );
}
