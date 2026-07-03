import { Maximize2, MonitorCog, Search } from "lucide-react";
import logo from "../assets/semantic-prism-logo-small.png";
import { Badge } from "./Badge";
import { IconButton } from "./IconButton";
import { ThemeToggle } from "./ThemeToggle";

interface TopBarProps {
  presentationMode: boolean;
  onTogglePresentation: () => void;
}

export function TopBar({ presentationMode, onTogglePresentation }: TopBarProps) {
  return (
    <div className="topbar-content">
      <div className="brand-lockup">
        <img src={logo} alt="Semantic Prism" className="brand-logo" />
      </div>
      <select aria-label="Project selector" defaultValue="Retail Order Platform">
        <option>Retail Order Platform</option>
      </select>
      <select aria-label="Workspace selector" defaultValue="Impact & Change Workspace">
        <option>Impact & Change Workspace</option>
      </select>
      <div className="topbar-search">
        <Search size={16} />
        <input aria-label="Search semantic objects" placeholder="Search semantic objects" />
      </div>
      <Badge tone="green">AI ready</Badge>
      <div className="minor-controls">
        <IconButton label="Workspace monitor">
          <MonitorCog size={17} />
        </IconButton>
      </div>
      <ThemeToggle />
      <IconButton label="Toggle presentation mode" active={presentationMode} onClick={onTogglePresentation}>
        <Maximize2 size={17} />
      </IconButton>
    </div>
  );
}
