import type { AdapterSemanticPayload, ArtefactRecord, ExtractionDiagnostic } from "@semantic-prism/shared-contracts";
import type { CoreConfig } from "../config/config.js";
import { requireExtractionRunner, requireProjectAccess } from "../auth/authorization.js";
import { readJson, sendError, sendJson } from "../http/response.js";
import type { Router } from "../http/router.js";
import type { SeedStore } from "../projects/seedStore.js";
import { validateSemanticPayload } from "../semantic/semanticValidation.js";
import { captureRepositorySnapshot } from "../snapshots/repositoryScanner.js";

interface ExtractionBody {
  adapterBindingId?: string;
  snapshotId?: string;
}

export function registerExtractionRoutes(router: Router, store: SeedStore, jwtSecret: string, config: CoreConfig) {
  router.get("/projects/:projectId/extraction-jobs", (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    sendJson(context.res, 200, { jobs: store.listExtractionJobs(context.params.projectId) });
  });

  router.get("/projects/:projectId/extraction-jobs/:jobId", (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    const job = store.getExtractionJob(context.params.projectId, context.params.jobId);
    if (!job) {
      sendError(context.res, 404, "not_found", "Extraction job not found");
      return;
    }
    sendJson(context.res, 200, { job });
  });

  router.post("/projects/:projectId/extraction-jobs", async (context) => {
    const user = requireExtractionRunner(context, context.params.projectId, store, jwtSecret);
    if (!user) {
      return;
    }
    const body = await readJson<ExtractionBody>(context.req);
    const binding = store.getAdapterBinding(context.params.projectId, body.adapterBindingId);
    if (!binding) {
      sendError(context.res, 404, "not_found", "Ready adapter binding not found");
      return;
    }
    const job = store.createExtractionJob({
      projectId: context.params.projectId,
      snapshotId: body.snapshotId ?? null,
      adapterBindingId: binding.id,
      requestedBy: user.id
    });
    const completed = await runExtractionJob({
      jobId: job.id,
      projectId: context.params.projectId,
      requestedBy: user.id,
      binding,
      requestedSnapshotId: body.snapshotId,
      store,
      adapterUrl: config.strutsAdapterUrl
    });
    sendJson(context.res, 201, { job: completed });
  });
}

async function runExtractionJob(input: {
  jobId: string;
  projectId: string;
  requestedBy: string;
  binding: NonNullable<ReturnType<SeedStore["getAdapterBinding"]>>;
  requestedSnapshotId?: string;
  store: SeedStore;
  adapterUrl: string;
}) {
  input.store.updateExtractionJob(input.jobId, { status: "running" });
  try {
    const snapshot = await ensureSnapshot(input);
    const artefacts = input.store.listArtefacts(input.projectId, snapshot.id);
    const adapterPayload = await callAdapter(input.adapterUrl, {
      repositoryRoot: input.binding.repositoryUrl,
      projectId: input.projectId,
      snapshotId: snapshot.id,
      adapterBindingId: input.binding.id,
      artefacts
    });
    const scopeErrors = validatePayloadScope(adapterPayload, input.projectId, snapshot.id);
    if (scopeErrors.length > 0) {
      return input.store.updateExtractionJob(input.jobId, {
        snapshotId: snapshot.id,
        status: "failed",
        artefactCount: artefacts.length,
        diagnostics: scopeErrors.map((message) => ({ level: "error", code: "adapter-output-scope-invalid", message }))
      });
    }
    const validation = validateSemanticPayload(adapterPayload);
    if (!validation.valid) {
      return input.store.updateExtractionJob(input.jobId, {
        snapshotId: snapshot.id,
        status: "failed",
        artefactCount: artefacts.length,
        diagnostics: validation.errors.map((message) => ({ level: "error", code: "adapter-output-invalid", message }))
      });
    }
    const counts = input.store.persistSemanticPayload(adapterPayload);
    const hasWarnings = adapterPayload.diagnostics.some((diagnostic) => diagnostic.level === "warning");
    return input.store.updateExtractionJob(input.jobId, {
      snapshotId: snapshot.id,
      status: hasWarnings ? "completed-with-warnings" : "completed",
      objectCount: counts.objectCount,
      relationshipCount: counts.relationshipCount,
      artefactCount: artefacts.length,
      diagnostics: adapterPayload.diagnostics
    });
  } catch (error) {
    return input.store.updateExtractionJob(input.jobId, {
      status: "failed",
      diagnostics: [
        {
          level: "error",
          code: "extraction-failed",
          message: error instanceof Error ? error.message : "Extraction failed"
        }
      ]
    });
  }
}

function validatePayloadScope(payload: AdapterSemanticPayload, projectId: string, snapshotId: string) {
  const errors: string[] = [];
  for (const object of payload.objects) {
    if (object.projectId !== projectId || object.snapshotId !== snapshotId) {
      errors.push(`Object ${object.id} does not match extraction project/snapshot scope`);
    }
  }
  for (const relationship of payload.relationships) {
    if (relationship.projectId !== projectId || relationship.snapshotId !== snapshotId) {
      errors.push(`Relationship ${relationship.id} does not match extraction project/snapshot scope`);
    }
  }
  for (const provenance of payload.provenance) {
    if (provenance.projectId !== projectId || provenance.snapshotId !== snapshotId) {
      errors.push(`Provenance ${provenance.id} does not match extraction project/snapshot scope`);
    }
  }
  return errors;
}

async function ensureSnapshot(input: {
  projectId: string;
  requestedBy: string;
  binding: NonNullable<ReturnType<SeedStore["getAdapterBinding"]>>;
  requestedSnapshotId?: string;
  store: SeedStore;
}) {
  if (input.requestedSnapshotId) {
    const existing = input.store.listSnapshots(input.projectId).find((snapshot) => snapshot.id === input.requestedSnapshotId);
    if (existing) {
      return existing;
    }
  }
  const snapshotId = `snap-${Date.now()}`;
  const capture = await captureRepositorySnapshot({
    repositoryRoot: input.binding.repositoryUrl,
    projectId: input.projectId,
    snapshotId,
    adapterBindingId: input.binding.id
  });
  const snapshot = input.store.createSnapshot({
    id: snapshotId,
    projectId: input.projectId,
    adapterBindingId: input.binding.id,
    branch: input.binding.branch,
    commitHash: capture.commitHash,
    status: "created",
    createdBy: input.requestedBy
  });
  input.store.replaceArtefactsForSnapshot(snapshotId, capture.artefacts);
  return snapshot;
}

async function callAdapter(adapterUrl: string, body: {
  repositoryRoot: string;
  projectId: string;
  snapshotId: string;
  adapterBindingId: string;
  artefacts: ArtefactRecord[];
}) {
  const response = await fetch(`${adapterUrl}/extract-semantic-objects`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    throw new Error(`Adapter extraction failed with HTTP ${response.status}`);
  }
  const payload = (await response.json()) as AdapterSemanticPayload & { diagnostics?: ExtractionDiagnostic[] };
  return {
    objects: payload.objects ?? [],
    relationships: payload.relationships ?? [],
    provenance: payload.provenance ?? [],
    diagnostics: payload.diagnostics ?? []
  };
}
