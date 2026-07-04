export const canonicalObjectKinds = [
  "Application",
  "Module",
  "Screen",
  "UserAction",
  "ApplicationAction",
  "BusinessRule",
  "ValidationRule",
  "Entity",
  "Field",
  "DataAccessOperation",
  "Message",
  "Artefact",
  "ProvenanceRecord"
] as const;

export type CanonicalObjectKind = (typeof canonicalObjectKinds)[number];

export const relationshipKinds = [
  "contains",
  "triggers",
  "reads",
  "writes",
  "evaluates",
  "validates",
  "emits",
  "affects",
  "implemented-by",
  "supported-by",
  "declared-in",
  "calls",
  "renders",
  "navigates-to",
  "has-provenance"
] as const;

export type RelationshipKind = (typeof relationshipKinds)[number];

export const adapterCapabilities = [
  "discoverArtefacts",
  "readArtefact",
  "extractSemanticObjects"
] as const;

export type AdapterCapability = (typeof adapterCapabilities)[number];

export const forbiddenR1Capabilities = [
  "generateArtefactDiff",
  "runValidation",
  "applyChangeSet",
  "invokeRuntime",
  "createChangeBasket",
  "commitChangeSet"
] as const;

export type R1Role = "admin" | "project-owner" | "analyst" | "viewer";

export type ExtractionStatus =
  | "queued"
  | "running"
  | "completed"
  | "completed-with-warnings"
  | "failed"
  | "cancelled";

export interface R1User {
  id: string;
  email: string;
  displayName: string;
  roles: R1Role[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  slug: string;
  role: R1Role;
  adapterType?: string;
}

export interface ProjectStatus {
  projectId: string;
  bindingReady: boolean;
  snapshotAvailable: boolean;
  latestExtractionStatus: ExtractionStatus | "not-run";
}

export interface AdapterDefinition {
  id: string;
  adapterType: "java-struts";
  displayName: string;
  serviceEndpoint: string;
  supportedCapabilities: AdapterCapability[];
  status: "active" | "inactive";
  version: string;
}

export interface RepositorySnapshot {
  id: string;
  projectId: string;
  adapterBindingId: string;
  branch: string;
  commitHash: string;
  status: "created" | "discovering" | "extracted" | "failed";
  createdBy: string;
  createdAt: string;
}

export interface ArtefactRecord {
  id: string;
  projectId: string;
  snapshotId: string;
  adapterBindingId: string;
  path: string;
  artefactType: string;
  language: string;
  contentHash: string;
  sizeBytes: number;
  encoding: "utf-8";
  metadata: Record<string, unknown>;
}

export interface SourceRange {
  startLine: number;
  startColumn?: number;
  endLine: number;
  endColumn?: number;
}

export interface SemanticObject {
  id: string;
  projectId: string;
  snapshotId: string;
  kind: CanonicalObjectKind;
  label: string;
  description?: string;
  synthetic?: boolean;
  attributes: Record<string, unknown>;
  provenanceIds: string[];
}

export interface SemanticRelationship {
  id: string;
  projectId: string;
  snapshotId: string;
  sourceObjectId: string;
  targetObjectId: string;
  kind: RelationshipKind;
  attributes: Record<string, unknown>;
}

export interface ProvenanceRecord {
  id: string;
  projectId: string;
  snapshotId: string;
  semanticObjectId: string;
  artefactId: string;
  sourceRange?: SourceRange;
  extractionType: "extracted" | "derived" | "ai-inferred" | "synthetic";
  extractorId: string;
  confidence: number;
  evidence: string[];
}

export interface ExtractionDiagnostic {
  level: "info" | "warning" | "error";
  code: string;
  message: string;
  artefactPath?: string;
  metadata?: Record<string, unknown>;
}

export interface AdapterSemanticPayload {
  objects: SemanticObject[];
  relationships: SemanticRelationship[];
  provenance: ProvenanceRecord[];
  diagnostics: ExtractionDiagnostic[];
}

export function isCanonicalObjectKind(value: string): value is CanonicalObjectKind {
  return canonicalObjectKinds.includes(value as CanonicalObjectKind);
}

export function isRelationshipKind(value: string): value is RelationshipKind {
  return relationshipKinds.includes(value as RelationshipKind);
}

export function assertR1Capability(capability: string): asserts capability is AdapterCapability {
  if (!adapterCapabilities.includes(capability as AdapterCapability)) {
    throw new Error(`Capability ${capability} is unsupported in R1`);
  }
}

export { r1OpenApiDocument } from "./openapi.js";
