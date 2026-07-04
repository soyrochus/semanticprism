import { requireProjectAccess, requireProjectManager } from "../auth/authorization.js";
import { readJson, sendError, sendJson } from "../http/response.js";
import type { Router } from "../http/router.js";
import type { SeedStore } from "../projects/seedStore.js";
import { captureRepositorySnapshot, readRepositoryArtefact } from "./repositoryScanner.js";

interface SnapshotBody {
  adapterBindingId?: string;
}

export function registerSnapshotRoutes(router: Router, store: SeedStore, jwtSecret: string) {
  router.get("/projects/:projectId/snapshots", (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    sendJson(context.res, 200, { snapshots: store.listSnapshots(context.params.projectId) });
  });

  router.post("/projects/:projectId/snapshots", async (context) => {
    const user = requireProjectManager(context, context.params.projectId, store, jwtSecret);
    if (!user) {
      return;
    }
    const body = await readJson<SnapshotBody>(context.req);
    const binding = store.getAdapterBinding(context.params.projectId, body.adapterBindingId);
    if (!binding) {
      sendError(context.res, 404, "not_found", "Ready adapter binding not found");
      return;
    }
    const snapshotId = `snap-${Date.now()}`;
    const capture = await captureRepositorySnapshot({
      repositoryRoot: binding.repositoryUrl,
      projectId: context.params.projectId,
      snapshotId,
      adapterBindingId: binding.id
    });
    const snapshot = store.createSnapshot({
      id: snapshotId,
      projectId: context.params.projectId,
      adapterBindingId: binding.id,
      branch: binding.branch,
      commitHash: capture.commitHash,
      status: "created",
      createdBy: user.id
    });
    const artefacts = store.replaceArtefactsForSnapshot(snapshotId, capture.artefacts);
    sendJson(context.res, 201, { snapshot, artefacts });
  });

  router.get("/projects/:projectId/artefacts", (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    const snapshotId = context.url.searchParams.get("snapshotId") ?? undefined;
    sendJson(context.res, 200, { artefacts: store.listArtefacts(context.params.projectId, snapshotId) });
  });

  router.get("/projects/:projectId/artefacts/:artefactId", (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    const artefact = store.getArtefact(context.params.projectId, context.params.artefactId);
    if (!artefact) {
      sendError(context.res, 404, "not_found", "Artefact not found");
      return;
    }
    sendJson(context.res, 200, { artefact });
  });

  router.get("/projects/:projectId/artefacts/:artefactId/content", async (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    const artefact = store.getArtefact(context.params.projectId, context.params.artefactId);
    if (!artefact) {
      sendError(context.res, 404, "not_found", "Artefact not found");
      return;
    }
    const binding = store.getAdapterBinding(context.params.projectId, artefact.adapterBindingId);
    if (!binding) {
      sendError(context.res, 404, "not_found", "Adapter binding not found");
      return;
    }
    const content = await readRepositoryArtefact(binding.repositoryUrl, artefact.path);
    if (content.contentHash !== artefact.contentHash) {
      sendError(context.res, 409, "repository_drift", "Artefact content hash no longer matches the captured snapshot");
      return;
    }
    sendJson(context.res, 200, {
      artefact,
      content: content.content,
      language: artefact.language,
      encoding: artefact.encoding,
      contentHash: content.contentHash
    });
  });
}
