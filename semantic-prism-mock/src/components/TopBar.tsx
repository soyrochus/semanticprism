import { LogOut, Maximize2, MonitorCog, Play, Search } from "lucide-react";
import logo from "../assets/semantic-prism-logo-small.png";
import { useR1Store } from "../store/r1Store";
import { Badge } from "./Badge";
import { IconButton } from "./IconButton";
import { ThemeToggle } from "./ThemeToggle";

interface TopBarProps {
  presentationMode: boolean;
  onTogglePresentation: () => void;
}

export function TopBar({ presentationMode, onTogglePresentation }: TopBarProps) {
  const session = useR1Store((store) => store.session);
  const projects = useR1Store((store) => store.projects);
  const currentProjectId = useR1Store((store) => store.currentProjectId);
  const projectStatus = useR1Store((store) => store.projectStatus);
  const loadProject = useR1Store((store) => store.loadProject);
  const logout = useR1Store((store) => store.logout);
  const dispatchCommand = useR1Store((store) => store.dispatchCommand);
  const currentRole = currentProjectId ? session?.user.memberships[currentProjectId] ?? session?.user.roles[0] : session?.user.roles[0];
  const canRunExtraction = currentRole === "project-owner" || currentRole === "analyst" || session?.user.roles.includes("admin");

  return (
    <div className="topbar-content">
      <div className="brand-lockup">
        <img src={logo} alt="Semantic Prism" className="brand-logo" />
      </div>
      <select
        aria-label="Project selector"
        value={currentProjectId}
        onChange={(event) => void loadProject(event.target.value)}
      >
        {projects.length === 0 ? <option value={currentProjectId}>Retail Orders Struts</option> : null}
        {projects.map((project) => (
          <option value={project.id} key={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <select aria-label="Workspace selector" defaultValue="R1 Semantic Workbench">
        <option>R1 Semantic Workbench</option>
      </select>
      <div className="topbar-search">
        <Search size={16} />
        <input aria-label="Search semantic objects" placeholder="Search semantic objects" />
      </div>
      <Badge tone={projectStatus?.latestExtractionStatus === "failed" ? "amber" : "green"}>
        {projectStatus?.latestExtractionStatus ?? "not-run"}
      </Badge>
      <Badge tone="violet">{currentRole ?? "viewer"} / read-only</Badge>
      <div className="minor-controls">
        {canRunExtraction ? (
          <IconButton label="Run extraction" onClick={() => void dispatchCommand({ type: "RunExtraction" })}>
            <Play size={17} />
          </IconButton>
        ) : null}
        <IconButton label="Workspace monitor">
          <MonitorCog size={17} />
        </IconButton>
      </div>
      <ThemeToggle />
      <IconButton label="Toggle presentation mode" active={presentationMode} onClick={onTogglePresentation}>
        <Maximize2 size={17} />
      </IconButton>
      <IconButton label="Log out" onClick={logout}>
        <LogOut size={17} />
      </IconButton>
    </div>
  );
}
