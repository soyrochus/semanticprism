import { requireProjectAccess } from "../auth/authorization.js";
import { readJson, sendError, sendJson } from "../http/response.js";
import type { Router } from "../http/router.js";
import type { SeedStore } from "../projects/seedStore.js";

export function registerSemanticQueryRoutes(router: Router, store: SeedStore, jwtSecret: string) {
  router.get("/projects/:projectId/objects", (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    const kind = context.url.searchParams.get("kind") ?? undefined;
    const objects = store.listSemanticObjects(context.params.projectId, kind);
    sendJson(context.res, 200, { objects, groups: groupByKind(objects) });
  });

  router.get("/projects/:projectId/objects/:objectId", (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    const object = store.getSemanticObject(context.params.projectId, context.params.objectId);
    if (!object) {
      sendError(context.res, 404, "not_found", "Semantic object not found");
      return;
    }
    const relationships = store.listRelationshipsForObject(context.params.projectId, context.params.objectId);
    const provenance = store.listProvenanceForObject(context.params.projectId, context.params.objectId);
    sendJson(context.res, 200, { object, relationships, provenance });
  });

  router.get("/projects/:projectId/objects/:objectId/related", (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    const relationships = store.listRelationshipsForObject(context.params.projectId, context.params.objectId);
    const objectIds = new Set(
      relationships.flatMap((relationship) => [relationship.sourceObjectId, relationship.targetObjectId]).filter((id) => id !== context.params.objectId)
    );
    const relatedObjects = [...objectIds].flatMap((id) => {
      const object = store.getSemanticObject(context.params.projectId, id);
      return object ? [object] : [];
    });
    sendJson(context.res, 200, { relationships, relatedObjects });
  });

  router.get("/projects/:projectId/subgraph", (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    sendJson(context.res, 200, {
      nodes: store.listSemanticObjects(context.params.projectId),
      edges: store.listRelationships(context.params.projectId)
    });
  });

  router.get("/projects/:projectId/search", (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    const query = context.url.searchParams.get("q") ?? "";
    sendJson(context.res, 200, { results: query ? store.searchSemanticObjects(context.params.projectId, query) : [] });
  });

  router.get("/projects/:projectId/provenance/:objectId", (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    sendJson(context.res, 200, {
      provenance: store.listProvenanceForObject(context.params.projectId, context.params.objectId)
    });
  });

  router.get("/projects/:projectId/source-trace/:objectId", (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    const object = store.getSemanticObject(context.params.projectId, context.params.objectId);
    if (!object) {
      sendError(context.res, 404, "not_found", "Semantic object not found");
      return;
    }
    const provenance = store.listProvenanceForObject(context.params.projectId, context.params.objectId);
    const traces = provenance.map((record) => ({
      provenance: record,
      artefact: store.getArtefact(context.params.projectId, record.artefactId),
      sourceRange: record.sourceRange,
      extractionType: record.extractionType,
      confidence: record.confidence,
      evidence: record.evidence
    }));
    sendJson(context.res, 200, { object, traces });
  });

  router.get("/projects/:projectId/workspace-layouts/:workspaceId", (context) => {
    if (!requireProjectAccess(context, context.params.projectId, store, jwtSecret)) {
      return;
    }
    const layout = store.getWorkspaceLayout(context.params.projectId, context.params.workspaceId);
    sendJson(context.res, 200, { layout: layout ?? null });
  });

  router.put("/projects/:projectId/workspace-layouts/:workspaceId", async (context) => {
    const user = requireProjectAccess(context, context.params.projectId, store, jwtSecret);
    if (!user) {
      return;
    }
    const body = await readJson<{ layout?: Record<string, unknown> }>(context.req);
    if (!body.layout) {
      sendError(context.res, 400, "invalid_request", "layout is required");
      return;
    }
    const layout = store.saveWorkspaceLayout({
      projectId: context.params.projectId,
      workspaceId: context.params.workspaceId,
      layout: body.layout,
      updatedBy: user.id
    });
    sendJson(context.res, 200, { layout });
  });
}

function groupByKind<T extends { kind: string }>(objects: T[]) {
  return objects.reduce<Record<string, T[]>>((groups, object) => {
    groups[object.kind] ??= [];
    groups[object.kind].push(object);
    return groups;
  }, {});
}
