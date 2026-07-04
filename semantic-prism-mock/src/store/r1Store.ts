import { create } from "zustand";
import type {
  ProjectStatus,
  ProjectSummary,
  ProvenanceRecord,
  SemanticObject,
  SemanticRelationship
} from "@semantic-prism/shared-contracts";
import * as api from "../api/r1Client";
import type { BottomTab, GraphMode, Theme, ValidationStatus } from "../components/WorkspaceContext";

type AllowedCommand =
  | { type: "SelectObject"; objectId: string }
  | { type: "OpenSourceTrace"; objectId?: string }
  | { type: "OpenArtefact"; artefactId: string }
  | { type: "RunExtraction" }
  | { type: "SaveWorkspaceLayout" }
  | { type: "ResetWorkspaceLayout" };

type ForbiddenCommand =
  | "ProposeBusinessRuleChange"
  | "CreateChangeBasket"
  | "CommitChangeSet"
  | "GenerateArtefactDiff"
  | "RunValidation"
  | "ApplyChangeSet"
  | "ApproveChangeSet"
  | "RejectChangeSet"
  | "RollbackChangeSet";

export interface R1StoreState {
  selectedObject: string;
  activeGraphMode: GraphMode;
  activeBottomTab: BottomTab;
  theme: Theme;
  changeActive: boolean;
  validationStatus: ValidationStatus;
  session: api.Session | null;
  projects: ProjectSummary[];
  currentProjectId: string;
  projectStatus: ProjectStatus | null;
  objects: SemanticObject[];
  objectGroups: Record<string, SemanticObject[]>;
  relationships: SemanticRelationship[];
  selectedDetail: { object: SemanticObject; relationships: SemanticRelationship[]; provenance: ProvenanceRecord[] } | null;
  sourceTrace: api.SourceTrace | null;
  artefactContent: api.ArtefactContent | null;
  loading: boolean;
  error: string;
  bootstrapSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadProject: (projectId: string) => Promise<void>;
  dispatchCommand: (command: AllowedCommand | { type: ForbiddenCommand }) => Promise<void>;
  setGraphMode: (mode: GraphMode) => void;
  setBottomTab: (tab: BottomTab) => void;
  setTheme: (theme: Theme) => void;
  setValidationStatus: (status: ValidationStatus) => void;
}

export const useR1Store = create<R1StoreState>((set, get) => ({
  selectedObject: "",
  activeGraphMode: "impact",
  activeBottomTab: "trace",
  theme: "light",
  changeActive: false,
  validationStatus: "not-run",
  session: restoreSession(),
  projects: [],
  currentProjectId: "",
  projectStatus: null,
  objects: [],
  objectGroups: {},
  relationships: [],
  selectedDetail: null,
  sourceTrace: null,
  artefactContent: null,
  loading: false,
  error: "",

  async bootstrapSession() {
    const session = get().session;
    if (!session) return;
    set({ loading: true, error: "" });
    try {
      const [me, projects] = await Promise.all([api.getCurrentUser(session.token), api.listProjects(session.token)]);
      const nextSession = { token: session.token, user: me.user };
      window.localStorage.setItem("semantic-prism-session", JSON.stringify(nextSession));
      set({ session: nextSession, projects: projects.projects });
      if (projects.projects[0]) {
        await get().loadProject(projects.projects[0].id);
      }
    } catch (error) {
      window.localStorage.removeItem("semantic-prism-session");
      set({ session: null, error: error instanceof Error ? error.message : "Session restore failed" });
    } finally {
      set({ loading: false });
    }
  },

  async login(email, password) {
    set({ loading: true, error: "" });
    try {
      const result = await api.login(email, password);
      const session = { token: result.token, user: result.user };
      window.localStorage.setItem("semantic-prism-session", JSON.stringify(session));
      set({ session });
      const projects = await api.listProjects(session.token);
      set({ projects: projects.projects });
      if (projects.projects[0]) {
        await get().loadProject(projects.projects[0].id);
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Login failed" });
    } finally {
      set({ loading: false });
    }
  },

  logout() {
    window.localStorage.removeItem("semantic-prism-session");
    set({ session: null, projects: [], currentProjectId: "", objects: [], objectGroups: {}, relationships: [] });
  },

  async loadProject(projectId) {
    const session = get().session;
    if (!session) return;
    set({ loading: true, currentProjectId: projectId, error: "" });
    try {
      const [status, objects, subgraph] = await Promise.all([
        api.getProjectStatus(session.token, projectId),
        api.listObjects(session.token, projectId),
        api.getSubgraph(session.token, projectId)
      ]);
      const selectedObject = objects.objects[0]?.id ?? "";
      set({
        projectStatus: status.status,
        objects: objects.objects,
        objectGroups: objects.groups,
        relationships: subgraph.edges,
        selectedObject
      });
      if (selectedObject) {
        await get().dispatchCommand({ type: "SelectObject", objectId: selectedObject });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Project load failed" });
    } finally {
      set({ loading: false });
    }
  },

  async dispatchCommand(command) {
    const session = get().session;
    const projectId = get().currentProjectId;
    if (!isAllowedCommand(command.type)) {
      set({ error: `${command.type} is unavailable in R1` });
      return;
    }
    if (!session || !projectId) return;
    if (command.type === "SelectObject") {
      set({ selectedObject: command.objectId });
      const detail = await api.getObjectDetail(session.token, projectId, command.objectId);
      set({ selectedDetail: detail });
      return;
    }
    if (command.type === "OpenSourceTrace") {
      const objectId = command.objectId ?? get().selectedObject;
      if (!objectId) return;
      const trace = await api.getSourceTrace(session.token, projectId, objectId);
      const artefactId = trace.traces[0]?.artefact?.id;
      set({ activeBottomTab: "trace", sourceTrace: trace });
      if (artefactId) {
        await get().dispatchCommand({ type: "OpenArtefact", artefactId });
      }
      return;
    }
    if (command.type === "OpenArtefact") {
      const content = await api.getArtefactContent(session.token, projectId, command.artefactId);
      set({ activeBottomTab: "source", artefactContent: content });
      return;
    }
    if (command.type === "RunExtraction") {
      await api.runExtraction(session.token, projectId);
      await get().loadProject(projectId);
      return;
    }
    if (command.type === "SaveWorkspaceLayout") {
      return;
    }
    if (command.type === "ResetWorkspaceLayout") {
      set({ activeGraphMode: "impact", activeBottomTab: "trace" });
    }
  },

  setGraphMode: (activeGraphMode) => set({ activeGraphMode }),
  setBottomTab: (activeBottomTab) => set({ activeBottomTab }),
  setTheme: (theme) => set({ theme }),
  setValidationStatus: (validationStatus) => set({ validationStatus })
}));

function restoreSession() {
  try {
    const raw = window.localStorage.getItem("semantic-prism-session");
    return raw ? (JSON.parse(raw) as api.Session) : null;
  } catch {
    return null;
  }
}

function isAllowedCommand(type: string): type is AllowedCommand["type"] {
  return ["SelectObject", "OpenSourceTrace", "OpenArtefact", "RunExtraction", "SaveWorkspaceLayout", "ResetWorkspaceLayout"].includes(type);
}
