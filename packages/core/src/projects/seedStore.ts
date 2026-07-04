import type {
  AdapterDefinition,
  AdapterSemanticPayload,
  ArtefactRecord,
  ExtractionDiagnostic,
  ProjectStatus,
  ProjectSummary,
  ProvenanceRecord,
  R1Role,
  RepositorySnapshot,
  SemanticObject,
  SemanticRelationship
} from "@semantic-prism/shared-contracts";
import { hashPassword } from "../auth/password.js";
import { validateSemanticPayload } from "../semantic/semanticValidation.js";

export interface ExtractionJobRecord {
  id: string;
  projectId: string;
  snapshotId: string | null;
  adapterBindingId: string;
  status: "queued" | "running" | "completed" | "completed-with-warnings" | "failed" | "cancelled";
  requestedBy: string;
  objectCount: number;
  relationshipCount: number;
  artefactCount: number;
  diagnostics: ExtractionDiagnostic[];
  createdAt: string;
  updatedAt: string;
}

export interface StoredUser {
  id: string;
  email: string;
  displayName: string;
  roles: R1Role[];
  passwordHash: string;
}

export interface StoredProject {
  id: string;
  slug: string;
  name: string;
  description: string;
}

interface AdapterBinding {
  id: string;
  projectId: string;
  adapterDefinitionId: string;
  repositoryUrl: string;
  branch: string;
  rootPath: string;
  credentialsRef: string | null;
  status: "ready" | "not-ready";
}

export type ProjectAdapterBinding = AdapterBinding;

const demoSalt = "semanticprismr1demo";

export class SeedStore {
  private users: StoredUser[] = [
    {
      id: "usr-admin",
      email: "admin@semantic-prism.local",
      displayName: "R1 Admin",
      roles: ["admin"],
      passwordHash: hashPassword("semantic-prism", demoSalt)
    },
    {
      id: "usr-owner",
      email: "owner@semantic-prism.local",
      displayName: "Project Owner",
      roles: ["project-owner"],
      passwordHash: hashPassword("semantic-prism", demoSalt)
    },
    {
      id: "usr-analyst",
      email: "analyst@semantic-prism.local",
      displayName: "Business Analyst",
      roles: ["analyst"],
      passwordHash: hashPassword("semantic-prism", demoSalt)
    },
    {
      id: "usr-viewer",
      email: "viewer@semantic-prism.local",
      displayName: "Read Only Viewer",
      roles: ["viewer"],
      passwordHash: hashPassword("semantic-prism", demoSalt)
    }
  ];

  private projects: StoredProject[] = [
    {
      id: "prj-retail-orders",
      slug: "retail-orders-struts",
      name: "Retail Orders Struts",
      description: "Stable local sample Struts repository for R1 extraction."
    }
  ];

  private memberships: Array<{ userId: string; projectId: string; role: R1Role }> = [
    { userId: "usr-admin", projectId: "prj-retail-orders", role: "project-owner" },
    { userId: "usr-owner", projectId: "prj-retail-orders", role: "project-owner" },
    { userId: "usr-analyst", projectId: "prj-retail-orders", role: "analyst" },
    { userId: "usr-viewer", projectId: "prj-retail-orders", role: "viewer" }
  ];

  adapterDefinitions: AdapterDefinition[] = [
    {
      id: "adp-java-struts",
      adapterType: "java-struts",
      displayName: "Java Struts Adapter",
      serviceEndpoint: "http://struts-adapter-service:4100",
      supportedCapabilities: ["discoverArtefacts", "readArtefact", "extractSemanticObjects"],
      status: "active",
      version: "0.1.0"
    }
  ];

  adapterBindings: AdapterBinding[] = [
    {
      id: "bind-retail-orders-struts",
      projectId: "prj-retail-orders",
      adapterDefinitionId: "adp-java-struts",
      repositoryUrl: "/sample-struts-repo",
      branch: "main",
      rootPath: ".",
      credentialsRef: null,
      status: "ready"
    }
  ];

  repositorySnapshots: RepositorySnapshot[] = [];
  artefacts: ArtefactRecord[] = [];
  semanticObjects: SemanticObject[] = [];
  semanticRelationships: SemanticRelationship[] = [];
  provenanceRecords: ProvenanceRecord[] = [];
  extractionJobs: ExtractionJobRecord[] = [];
  workspaceLayouts: Array<{
    projectId: string;
    workspaceId: string;
    layout: Record<string, unknown>;
    updatedBy: string;
    updatedAt: string;
  }> = [];

  findUserByEmail(email: string) {
    return this.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  listUsers() {
    return this.users.map(({ passwordHash: _passwordHash, ...user }) => user);
  }

  getUser(userId: string) {
    return this.users.find((user) => user.id === userId);
  }

  createUser(input: { email: string; displayName: string; roles?: R1Role[]; password?: string }) {
    if (this.findUserByEmail(input.email)) {
      throw new Error("User email already exists");
    }
    const user: StoredUser = {
      id: `usr-${Date.now()}-${this.users.length + 1}`,
      email: input.email,
      displayName: input.displayName,
      roles: input.roles?.length ? input.roles : ["viewer"],
      passwordHash: hashPassword(input.password ?? "semantic-prism")
    };
    this.users.push(user);
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
  }

  getAuthenticatedUser(userId: string) {
    const user = this.users.find((candidate) => candidate.id === userId);
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      roles: user.roles,
      memberships: Object.fromEntries(
        this.memberships.filter((membership) => membership.userId === userId).map((membership) => [membership.projectId, membership.role])
      )
    };
  }

  listProjectsForUser(userId: string): ProjectSummary[] {
    const user = this.getAuthenticatedUser(userId);
    if (!user) {
      return [];
    }
    return this.memberships
      .filter((membership) => membership.userId === userId)
      .flatMap((membership): ProjectSummary[] => {
        const project = this.projects.find((candidate) => candidate.id === membership.projectId);
        const binding = this.adapterBindings.find((candidate) => candidate.projectId === membership.projectId);
        if (!project) {
          return [];
        }
        return [
          {
            id: project.id,
            slug: project.slug,
            name: project.name,
            role: membership.role,
            adapterType: binding ? "java-struts" : undefined
          }
        ];
      });
  }

  listAllProjects() {
    return [...this.projects];
  }

  createProject(input: { slug: string; name: string; description?: string }) {
    if (this.projects.some((project) => project.slug === input.slug)) {
      throw new Error("Project slug already exists");
    }
    const project: StoredProject = {
      id: `prj-${input.slug}`,
      slug: input.slug,
      name: input.name,
      description: input.description ?? ""
    };
    this.projects.push(project);
    return project;
  }

  getProject(projectId: string) {
    return this.projects.find((project) => project.id === projectId);
  }

  getAdapterBinding(projectId: string, bindingId?: string) {
    if (bindingId) {
      return this.adapterBindings.find((binding) => binding.projectId === projectId && binding.id === bindingId);
    }
    return this.adapterBindings.find((binding) => binding.projectId === projectId && binding.status === "ready");
  }

  listMemberships(projectId: string) {
    return this.memberships
      .filter((membership) => membership.projectId === projectId)
      .map((membership) => {
        const user = this.users.find((candidate) => candidate.id === membership.userId);
        return {
          ...membership,
          user: user
            ? {
                id: user.id,
                email: user.email,
                displayName: user.displayName,
                roles: user.roles
              }
            : null
        };
      });
  }

  upsertMembership(input: { userId: string; projectId: string; role: R1Role }) {
    if (!this.getUser(input.userId)) {
      throw new Error("User not found");
    }
    if (!this.getProject(input.projectId)) {
      throw new Error("Project not found");
    }
    const existing = this.memberships.find(
      (membership) => membership.userId === input.userId && membership.projectId === input.projectId
    );
    if (existing) {
      existing.role = input.role;
      return existing;
    }
    const membership = { ...input };
    this.memberships.push(membership);
    return membership;
  }

  removeMembership(input: { userId: string; projectId: string }) {
    const before = this.memberships.length;
    this.memberships = this.memberships.filter(
      (membership) => membership.userId !== input.userId || membership.projectId !== input.projectId
    );
    return this.memberships.length !== before;
  }

  getProjectStatus(projectId: string): ProjectStatus {
    const bindingReady = this.adapterBindings.some((binding) => binding.projectId === projectId && binding.status === "ready");
    const latestSnapshot = this.repositorySnapshots.find((snapshot) => snapshot.projectId === projectId);
    const latestJob = this.extractionJobs.find((job) => job.projectId === projectId);
    return {
      projectId,
      bindingReady,
      snapshotAvailable: Boolean(latestSnapshot),
      latestExtractionStatus: latestJob?.status ?? "not-run"
    };
  }

  createSnapshot(input: Omit<RepositorySnapshot, "createdAt">) {
    const snapshot: RepositorySnapshot = {
      ...input,
      createdAt: new Date().toISOString()
    };
    this.repositorySnapshots.unshift(snapshot);
    return snapshot;
  }

  listSnapshots(projectId: string) {
    return this.repositorySnapshots.filter((snapshot) => snapshot.projectId === projectId);
  }

  replaceArtefactsForSnapshot(snapshotId: string, artefacts: ArtefactRecord[]) {
    this.artefacts = this.artefacts.filter((artefact) => artefact.snapshotId !== snapshotId);
    this.artefacts.push(...artefacts);
    return artefacts;
  }

  listArtefacts(projectId: string, snapshotId?: string) {
    return this.artefacts.filter(
      (artefact) => artefact.projectId === projectId && (!snapshotId || artefact.snapshotId === snapshotId)
    );
  }

  getArtefact(projectId: string, artefactId: string) {
    return this.artefacts.find((artefact) => artefact.projectId === projectId && artefact.id === artefactId);
  }

  persistSemanticPayload(payload: AdapterSemanticPayload) {
    const validation = validateSemanticPayload(payload);
    if (!validation.valid) {
      throw new Error(validation.errors.join("; "));
    }
    const objectIds = new Set(payload.objects.map((object) => object.id));
    const relationshipIds = new Set(payload.relationships.map((relationship) => relationship.id));
    const provenanceIds = new Set(payload.provenance.map((provenance) => provenance.id));
    this.semanticObjects = this.semanticObjects.filter((object) => !objectIds.has(object.id));
    this.semanticRelationships = this.semanticRelationships.filter((relationship) => !relationshipIds.has(relationship.id));
    this.provenanceRecords = this.provenanceRecords.filter((provenance) => !provenanceIds.has(provenance.id));
    this.semanticObjects.push(...payload.objects);
    this.semanticRelationships.push(...payload.relationships);
    this.provenanceRecords.push(...payload.provenance);
    return {
      objectCount: payload.objects.length,
      relationshipCount: payload.relationships.length,
      provenanceCount: payload.provenance.length
    };
  }

  listSemanticObjects(projectId: string, kind?: string) {
    const snapshotId = this.latestSnapshotId(projectId);
    return this.semanticObjects.filter(
      (object) => object.projectId === projectId && (!snapshotId || object.snapshotId === snapshotId) && (!kind || object.kind === kind)
    );
  }

  getSemanticObject(projectId: string, objectId: string) {
    const snapshotId = this.latestSnapshotId(projectId);
    return this.semanticObjects.find(
      (object) => object.projectId === projectId && object.id === objectId && (!snapshotId || object.snapshotId === snapshotId)
    );
  }

  listRelationships(projectId: string) {
    const snapshotId = this.latestSnapshotId(projectId);
    return this.semanticRelationships.filter(
      (relationship) => relationship.projectId === projectId && (!snapshotId || relationship.snapshotId === snapshotId)
    );
  }

  listRelationshipsForObject(projectId: string, objectId: string) {
    const snapshotId = this.latestSnapshotId(projectId);
    return this.semanticRelationships.filter(
      (relationship) =>
        relationship.projectId === projectId &&
        (!snapshotId || relationship.snapshotId === snapshotId) &&
        (relationship.sourceObjectId === objectId || relationship.targetObjectId === objectId)
    );
  }

  listProvenanceForObject(projectId: string, objectId: string) {
    const snapshotId = this.latestSnapshotId(projectId);
    return this.provenanceRecords.filter(
      (provenance) =>
        provenance.projectId === projectId && provenance.semanticObjectId === objectId && (!snapshotId || provenance.snapshotId === snapshotId)
    );
  }

  searchSemanticObjects(projectId: string, query: string) {
    const needle = query.toLowerCase();
    const snapshotId = this.latestSnapshotId(projectId);
    return this.semanticObjects.filter(
      (object) =>
        object.projectId === projectId &&
        (!snapshotId || object.snapshotId === snapshotId) &&
        (object.label.toLowerCase().includes(needle) ||
          object.kind.toLowerCase().includes(needle) ||
          object.description?.toLowerCase().includes(needle))
    );
  }

  getWorkspaceLayout(projectId: string, workspaceId: string) {
    return this.workspaceLayouts.find((layout) => layout.projectId === projectId && layout.workspaceId === workspaceId);
  }

  saveWorkspaceLayout(input: {
    projectId: string;
    workspaceId: string;
    layout: Record<string, unknown>;
    updatedBy: string;
  }) {
    const existing = this.getWorkspaceLayout(input.projectId, input.workspaceId);
    const updatedAt = new Date().toISOString();
    if (existing) {
      existing.layout = input.layout;
      existing.updatedBy = input.updatedBy;
      existing.updatedAt = updatedAt;
      return existing;
    }
    const layout = { ...input, updatedAt };
    this.workspaceLayouts.push(layout);
    return layout;
  }

  createExtractionJob(input: {
    projectId: string;
    snapshotId: string | null;
    adapterBindingId: string;
    requestedBy: string;
  }) {
    const now = new Date().toISOString();
    const job: ExtractionJobRecord = {
      id: `job-${Date.now()}-${this.extractionJobs.length + 1}`,
      projectId: input.projectId,
      snapshotId: input.snapshotId,
      adapterBindingId: input.adapterBindingId,
      requestedBy: input.requestedBy,
      status: "queued",
      objectCount: 0,
      relationshipCount: 0,
      artefactCount: 0,
      diagnostics: [],
      createdAt: now,
      updatedAt: now
    };
    this.extractionJobs.unshift(job);
    return job;
  }

  updateExtractionJob(jobId: string, patch: Partial<Omit<ExtractionJobRecord, "id" | "createdAt">>) {
    const job = this.extractionJobs.find((candidate) => candidate.id === jobId);
    if (!job) {
      return null;
    }
    Object.assign(job, patch, { updatedAt: new Date().toISOString() });
    return job;
  }

  listExtractionJobs(projectId: string) {
    return this.extractionJobs.filter((job) => job.projectId === projectId);
  }

  getExtractionJob(projectId: string, jobId: string) {
    return this.extractionJobs.find((job) => job.projectId === projectId && job.id === jobId);
  }

  private latestSnapshotId(projectId: string) {
    return this.repositorySnapshots.find((snapshot) => snapshot.projectId === projectId)?.id;
  }
}
