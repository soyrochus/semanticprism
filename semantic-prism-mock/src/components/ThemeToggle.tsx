import { Moon, Sun } from "lucide-react";
import { IconButton } from "./IconButton";
import { useWorkspace } from "./WorkspaceContext";

export function ThemeToggle() {
  const { state, setTheme } = useWorkspace();
  const dark = state.theme === "dark";

  return (
    <IconButton label={dark ? "Switch to light theme" : "Switch to dark theme"} onClick={() => setTheme(dark ? "light" : "dark")}>
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </IconButton>
  );
}
