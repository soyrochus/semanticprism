import type {
  ArtefactRecord,
  ProjectStatus,
  ProjectSummary,
  ProvenanceRecord,
  R1User,
  SemanticObject,
  SemanticRelationship
} from "@semantic-prism/shared-contracts";

const API_URL = import.meta.env.VITE_CORE_API_URL ?? "http://localhost:4000";

export interface Session {
  token: string;
  user: R1User & { memberships: Record<string, string> };
}

export interface SourceTrace {
  object: SemanticObject;
  traces: Array<{
    provenance: ProvenanceRecord;
    artefact?: ArtefactRecord;
    sourceRange?: ProvenanceRecord["sourceRange"];
    extractionType: ProvenanceRecord["extractionType"];
    confidence: number;
    evidence: string[];
  }>;
}

export interface ArtefactContent {
  artefact: ArtefactRecord;
  content: string;
  language: string;
  encoding: string;
  contentHash: string;
}

export async function login(email: string, password: string) {
  return request<{ token: string; user: Session["user"] }>("/auth/login", {
    method: "POST",
    body: { email, password }
  });
}

export async function listProjects(token: string) {
  return request<{ projects: ProjectSummary[] }>("/projects", { token });
}

export async function getCurrentUser(token: string) {
  return request<{ user: Session["user"] }>("/auth/me", { token });
}

export async function getProjectStatus(token: string, projectId: string) {
  return request<{ status: ProjectStatus }>(`/projects/${projectId}/status`, { token });
}

export async function listObjects(token: string, projectId: string) {
  return request<{ objects: SemanticObject[]; groups: Record<string, SemanticObject[]> }>(`/projects/${projectId}/objects`, { token });
}

export async function getObjectDetail(token: string, projectId: string, objectId: string) {
  return request<{ object: SemanticObject; relationships: SemanticRelationship[]; provenance: ProvenanceRecord[] }>(
    `/projects/${projectId}/objects/${objectId}`,
    { token }
  );
}

export async function getSubgraph(token: string, projectId: string) {
  return request<{ nodes: SemanticObject[]; edges: SemanticRelationship[] }>(`/projects/${projectId}/subgraph`, { token });
}

export async function getSourceTrace(token: string, projectId: string, objectId: string) {
  return request<SourceTrace>(`/projects/${projectId}/source-trace/${objectId}`, { token });
}

export async function getArtefactContent(token: string, projectId: string, artefactId: string) {
  return request<ArtefactContent>(`/projects/${projectId}/artefacts/${artefactId}/content`, { token });
}

export async function runExtraction(token: string, projectId: string) {
  return request<{ job: { id: string; status: string; diagnostics: unknown[] } }>(`/projects/${projectId}/extraction-jobs`, {
    method: "POST",
    token,
    body: {}
  });
}

async function request<T>(path: string, init: { method?: string; token?: string; body?: unknown } = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: init.method ?? "GET",
    headers: {
      ...(init.token ? { authorization: `Bearer ${init.token}` } : {}),
      ...(init.body ? { "content-type": "application/json" } : {})
    },
    body: init.body ? JSON.stringify(init.body) : undefined
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error?.message ?? `Request failed with HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}
