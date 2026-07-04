import assert from "node:assert/strict";
import { createServer } from "node:http";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import type { AdapterSemanticPayload } from "@semantic-prism/shared-contracts";
import { canRunExtraction } from "../auth/authorization.js";
import { createCoreApp } from "../app.js";

const sampleRepoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../../../sample-struts-repo");

async function request(app: ReturnType<typeof createCoreApp>, path: string, init: { method?: string; token?: string; body?: unknown } = {}) {
  const server = app.server.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert(address && typeof address === "object");
  try {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, {
      method: init.method ?? "GET",
      headers: {
        ...(init.token ? { authorization: `Bearer ${init.token}` } : {}),
        ...(init.body ? { "content-type": "application/json" } : {})
      },
      body: init.body ? JSON.stringify(init.body) : undefined
    });
    return {
      status: response.status,
      body: response.status === 204 ? null : await response.json()
    };
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

type AdapterResponse = AdapterSemanticPayload | { status: number; body: unknown } | ((body: Record<string, unknown>) => AdapterSemanticPayload);

async function withAdapter<T>(payload: AdapterResponse, run: (adapterUrl: string) => Promise<T>) {
  const server = createServer(async (req, res) => {
    if (req.url !== "/extract-semantic-objects") {
      res.writeHead(404).end();
      return;
    }
    if ("status" in payload) {
      res.writeHead(payload.status, { "content-type": "application/json" }).end(JSON.stringify(payload.body));
      return;
    }
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const requestBody = chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
    const responsePayload = typeof payload === "function" ? payload(requestBody) : payload;
    res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(responsePayload));
  }).listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert(address && typeof address === "object");
  try {
    return await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

function createTestCoreApp(adapterUrl: string) {
  return createCoreApp({
    nodeEnv: "test",
    host: "127.0.0.1",
    port: 0,
    jwtSecret: "test-secret",
    databaseUrl: "postgres://unused",
    strutsAdapterUrl: adapterUrl,
    sampleRepositoryPath: sampleRepoRoot
  });
}

function validAdapterPayload(options: { warning?: boolean } = {}): AdapterSemanticPayload {
  return {
    objects: [
      {
        id: "obj-screen",
        projectId: "prj-retail-orders",
        snapshotId: "snap-test",
        kind: "Screen",
        label: "Order",
        attributes: {},
        provenanceIds: ["prov-screen"]
      },
      {
        id: "obj-action",
        projectId: "prj-retail-orders",
        snapshotId: "snap-test",
        kind: "ApplicationAction",
        label: "SubmitOrderAction",
        attributes: {},
        provenanceIds: ["prov-action"]
      }
    ],
    relationships: [
      {
        id: "rel-screen-action",
        projectId: "prj-retail-orders",
        snapshotId: "snap-test",
        sourceObjectId: "obj-screen",
        targetObjectId: "obj-action",
        kind: "triggers",
        attributes: {}
      }
    ],
    provenance: [
      {
        id: "prov-screen",
        projectId: "prj-retail-orders",
        snapshotId: "snap-test",
        semanticObjectId: "obj-screen",
        artefactId: "art-order",
        extractionType: "extracted",
        extractorId: "test-adapter",
        confidence: 0.9,
        evidence: ["fixture"]
      },
      {
        id: "prov-action",
        projectId: "prj-retail-orders",
        snapshotId: "snap-test",
        semanticObjectId: "obj-action",
        artefactId: "art-order",
        extractionType: "extracted",
        extractorId: "test-adapter",
        confidence: 0.9,
        evidence: ["fixture"]
      }
    ],
    diagnostics: options.warning
      ? [{ level: "warning", code: "partial", message: "Partial extraction warning" }]
      : []
  };
}

function scopedValidAdapterPayload(options: { warning?: boolean; invalidKind?: boolean } = {}) {
  return (body: Record<string, unknown>): AdapterSemanticPayload => {
    const payload = validAdapterPayload(options);
    const snapshotId = String(body.snapshotId);
    const artefacts = body.artefacts as Array<{ id: string }> | undefined;
    const artefactId = artefacts?.[0]?.id ?? "art-order";
    for (const object of payload.objects) {
      object.snapshotId = snapshotId;
      object.projectId = String(body.projectId);
    }
    for (const relationship of payload.relationships) {
      relationship.snapshotId = snapshotId;
      relationship.projectId = String(body.projectId);
    }
    for (const provenance of payload.provenance) {
      provenance.snapshotId = snapshotId;
      provenance.projectId = String(body.projectId);
      provenance.artefactId = artefactId;
    }
    if (options.invalidKind) {
      payload.objects[0].kind = "StrutsAction" as never;
    }
    return payload;
  };
}

test("health endpoint returns ok", async () => {
  const app = createCoreApp();
  const response = await request(app, "/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("login returns token and assigned projects are membership scoped", async () => {
  const app = createCoreApp();
  const login = await request(app, "/auth/login", {
    method: "POST",
    body: { email: "viewer@semantic-prism.local", password: "semantic-prism" }
  });
  assert.equal(login.status, 200);
  assert.equal(login.body.user.memberships["prj-retail-orders"], "viewer");

  const projects = await request(app, "/projects", { token: login.body.token });
  assert.equal(projects.status, 200);
  assert.equal(projects.body.projects.length, 1);
  assert.equal(projects.body.projects[0].role, "viewer");
});

test("project-scoped APIs reject unauthenticated access", async () => {
  const app = createCoreApp();
  const response = await request(app, "/projects");
  assert.equal(response.status, 401);
});

test("viewer cannot create adapter binding", async () => {
  const app = createCoreApp();
  const login = await request(app, "/auth/login", {
    method: "POST",
    body: { email: "viewer@semantic-prism.local", password: "semantic-prism" }
  });
  const response = await request(app, "/projects/prj-retail-orders/adapter-bindings", {
    method: "POST",
    token: login.body.token,
    body: { repositoryUrl: "/sample-struts-repo" }
  });
  assert.equal(response.status, 403);
});

test("project owner can create adapter binding", async () => {
  const app = createCoreApp();
  const login = await request(app, "/auth/login", {
    method: "POST",
    body: { email: "owner@semantic-prism.local", password: "semantic-prism" }
  });
  const response = await request(app, "/projects/prj-retail-orders/adapter-bindings", {
    method: "POST",
    token: login.body.token,
    body: { repositoryUrl: "/sample-struts-repo", branch: "main" }
  });
  assert.equal(response.status, 201);
  assert.equal(response.body.binding.status, "ready");
});

test("R1 unsupported capabilities are rejected", async () => {
  const app = createCoreApp();
  const response = await request(app, "/projects/prj-retail-orders/unsupported-capability", {
    method: "POST",
    body: { capability: "generateArtefactDiff" }
  });
  assert.equal(response.status, 400);
  assert.equal(response.body.error.code, "unsupported_capability");
});

test("non-admin users cannot access admin APIs", async () => {
  const app = createCoreApp();
  const login = await request(app, "/auth/login", {
    method: "POST",
    body: { email: "owner@semantic-prism.local", password: "semantic-prism" }
  });
  const response = await request(app, "/admin/users", { token: login.body.token });
  assert.equal(response.status, 403);
});

test("admin can create a project and assign membership", async () => {
  const app = createCoreApp();
  const adminLogin = await request(app, "/auth/login", {
    method: "POST",
    body: { email: "admin@semantic-prism.local", password: "semantic-prism" }
  });
  const user = await request(app, "/admin/users", {
    method: "POST",
    token: adminLogin.body.token,
    body: {
      email: "assigned-viewer@semantic-prism.local",
      displayName: "Assigned Viewer",
      roles: ["viewer"],
      password: "semantic-prism"
    }
  });
  assert.equal(user.status, 201);

  const project = await request(app, "/admin/projects", {
    method: "POST",
    token: adminLogin.body.token,
    body: {
      slug: "assigned-project",
      name: "Assigned Project"
    }
  });
  assert.equal(project.status, 201);

  const membership = await request(app, `/admin/projects/${project.body.project.id}/memberships`, {
    method: "POST",
    token: adminLogin.body.token,
    body: {
      userId: user.body.user.id,
      role: "analyst"
    }
  });
  assert.equal(membership.status, 201);
  assert.equal(membership.body.membership.role, "analyst");

  const assignedLogin = await request(app, "/auth/login", {
    method: "POST",
    body: { email: "assigned-viewer@semantic-prism.local", password: "semantic-prism" }
  });
  const projects = await request(app, "/projects", { token: assignedLogin.body.token });
  assert.equal(projects.body.projects.some((candidate: { id: string }) => candidate.id === project.body.project.id), true);
});

test("extraction permissions allow analyst and project owner but reject viewer", async () => {
  const app = createCoreApp();
  const viewer = app.store.getAuthenticatedUser("usr-viewer");
  const analyst = app.store.getAuthenticatedUser("usr-analyst");
  const owner = app.store.getAuthenticatedUser("usr-owner");
  assert(viewer && analyst && owner);
  assert.equal(canRunExtraction(viewer, "prj-retail-orders"), false);
  assert.equal(canRunExtraction(analyst, "prj-retail-orders"), true);
  assert.equal(canRunExtraction(owner, "prj-retail-orders"), true);
});

test("project owner can create a repository snapshot and read captured artefact content", async () => {
  const app = createCoreApp();
  const login = await request(app, "/auth/login", {
    method: "POST",
    body: { email: "owner@semantic-prism.local", password: "semantic-prism" }
  });
  const binding = await request(app, "/projects/prj-retail-orders/adapter-bindings", {
    method: "POST",
    token: login.body.token,
    body: { repositoryUrl: sampleRepoRoot, branch: "main" }
  });
  assert.equal(binding.status, 201);

  const created = await request(app, "/projects/prj-retail-orders/snapshots", {
    method: "POST",
    token: login.body.token,
    body: { adapterBindingId: binding.body.binding.id }
  });
  assert.equal(created.status, 201);
  assert.equal(created.body.snapshot.adapterBindingId, binding.body.binding.id);
  assert.equal(created.body.snapshot.commitHash.startsWith("tree-"), true);
  assert(created.body.artefacts.length > 0);

  const listed = await request(app, `/projects/prj-retail-orders/artefacts?snapshotId=${created.body.snapshot.id}`, {
    token: login.body.token
  });
  assert.equal(listed.status, 200);
  assert.equal(listed.body.artefacts.every((artefact: { snapshotId: string }) => artefact.snapshotId === created.body.snapshot.id), true);

  const jsp = listed.body.artefacts.find(
    (artefact: { artefactType: string; path: string }) => artefact.artefactType === "jsp-screen" && artefact.path.endsWith("order.jsp")
  );
  assert(jsp);
  const content = await request(app, `/projects/prj-retail-orders/artefacts/${jsp.id}/content`, {
    token: login.body.token
  });
  assert.equal(content.status, 200);
  assert.equal(content.body.contentHash, jsp.contentHash);
  assert.equal(content.body.language, "jsp");
  assert.match(content.body.content, /html:form/);
});

test("viewer cannot create repository snapshots but can list assigned project artefacts", async () => {
  const app = createCoreApp();
  const ownerLogin = await request(app, "/auth/login", {
    method: "POST",
    body: { email: "owner@semantic-prism.local", password: "semantic-prism" }
  });
  const binding = await request(app, "/projects/prj-retail-orders/adapter-bindings", {
    method: "POST",
    token: ownerLogin.body.token,
    body: { repositoryUrl: sampleRepoRoot, branch: "main" }
  });
  await request(app, "/projects/prj-retail-orders/snapshots", {
    method: "POST",
    token: ownerLogin.body.token,
    body: { adapterBindingId: binding.body.binding.id }
  });

  const viewerLogin = await request(app, "/auth/login", {
    method: "POST",
    body: { email: "viewer@semantic-prism.local", password: "semantic-prism" }
  });
  const denied = await request(app, "/projects/prj-retail-orders/snapshots", {
    method: "POST",
    token: viewerLogin.body.token,
    body: { adapterBindingId: binding.body.binding.id }
  });
  assert.equal(denied.status, 403);

  const artefacts = await request(app, "/projects/prj-retail-orders/artefacts", { token: viewerLogin.body.token });
  assert.equal(artefacts.status, 200);
  assert(artefacts.body.artefacts.length > 0);
});

test("project owner can create extraction job and project status reflects warnings", async () => {
  await withAdapter(scopedValidAdapterPayload({ warning: true }), async (adapterUrl) => {
    const app = createTestCoreApp(adapterUrl);
    const login = await request(app, "/auth/login", {
      method: "POST",
      body: { email: "owner@semantic-prism.local", password: "semantic-prism" }
    });
    const binding = await request(app, "/projects/prj-retail-orders/adapter-bindings", {
      method: "POST",
      token: login.body.token,
      body: { repositoryUrl: sampleRepoRoot, branch: "main" }
    });
    const created = await request(app, "/projects/prj-retail-orders/extraction-jobs", {
      method: "POST",
      token: login.body.token,
      body: { adapterBindingId: binding.body.binding.id }
    });
    assert.equal(created.status, 201);
    assert.equal(created.body.job.status, "completed-with-warnings");
    assert.equal(created.body.job.objectCount, 2);
    assert(created.body.job.artefactCount > 0);
    assert.equal(app.store.semanticObjects.every((object) => object.snapshotId === created.body.job.snapshotId), true);
    assert.equal(app.store.artefacts.every((artefact) => artefact.snapshotId === created.body.job.snapshotId), true);

    const detail = await request(app, `/projects/prj-retail-orders/extraction-jobs/${created.body.job.id}`, {
      token: login.body.token
    });
    assert.equal(detail.body.job.id, created.body.job.id);

    const status = await request(app, "/projects/prj-retail-orders/status", { token: login.body.token });
    assert.equal(status.body.status.latestExtractionStatus, "completed-with-warnings");
    assert.equal(status.body.status.snapshotAvailable, true);

    const objects = await request(app, "/projects/prj-retail-orders/objects", { token: login.body.token });
    assert.equal(objects.status, 200);
    assert.equal(objects.body.groups.Screen.length, 1);

    const objectDetail = await request(app, "/projects/prj-retail-orders/objects/obj-screen", { token: login.body.token });
    assert.equal(objectDetail.status, 200);
    assert.equal(objectDetail.body.object.kind, "Screen");
    assert.equal(objectDetail.body.provenance.length, 1);

    const related = await request(app, "/projects/prj-retail-orders/objects/obj-screen/related", { token: login.body.token });
    assert.equal(related.body.relatedObjects[0].id, "obj-action");

    const subgraph = await request(app, "/projects/prj-retail-orders/subgraph", { token: login.body.token });
    assert.equal(subgraph.body.nodes.length, 2);
    assert.equal(subgraph.body.edges.length, 1);

    const search = await request(app, "/projects/prj-retail-orders/search?q=SubmitOrder", { token: login.body.token });
    assert.equal(search.body.results[0].id, "obj-action");

    const provenance = await request(app, "/projects/prj-retail-orders/provenance/obj-screen", { token: login.body.token });
    assert.equal(provenance.body.provenance[0].id, "prov-screen");

    const trace = await request(app, "/projects/prj-retail-orders/source-trace/obj-screen", { token: login.body.token });
    assert.equal(trace.body.object.id, "obj-screen");
    assert(trace.body.traces[0].artefact.id);

    const savedLayout = await request(app, "/projects/prj-retail-orders/workspace-layouts/default", {
      method: "PUT",
      token: login.body.token,
      body: { layout: { leftWidth: 320, selectedObjectId: "obj-screen" } }
    });
    assert.equal(savedLayout.status, 200);
    const loadedLayout = await request(app, "/projects/prj-retail-orders/workspace-layouts/default", { token: login.body.token });
    assert.equal(loadedLayout.body.layout.layout.selectedObjectId, "obj-screen");
  });
});

test("invalid adapter payload fails extraction without persisting semantic objects", async () => {
  await withAdapter(scopedValidAdapterPayload({ invalidKind: true }), async (adapterUrl) => {
    const app = createTestCoreApp(adapterUrl);
    const login = await request(app, "/auth/login", {
      method: "POST",
      body: { email: "owner@semantic-prism.local", password: "semantic-prism" }
    });
    const binding = await request(app, "/projects/prj-retail-orders/adapter-bindings", {
      method: "POST",
      token: login.body.token,
      body: { repositoryUrl: sampleRepoRoot, branch: "main" }
    });
    const created = await request(app, "/projects/prj-retail-orders/extraction-jobs", {
      method: "POST",
      token: login.body.token,
      body: { adapterBindingId: binding.body.binding.id }
    });
    assert.equal(created.body.job.status, "failed");
    assert.equal(created.body.job.diagnostics[0].code, "adapter-output-invalid");
    assert.equal(app.store.semanticObjects.length, 0);
  });
});

test("adapter HTTP failure marks extraction failed", async () => {
  await withAdapter({ status: 500, body: { error: "adapter down" } }, async (adapterUrl) => {
    const app = createTestCoreApp(adapterUrl);
    const login = await request(app, "/auth/login", {
      method: "POST",
      body: { email: "owner@semantic-prism.local", password: "semantic-prism" }
    });
    const binding = await request(app, "/projects/prj-retail-orders/adapter-bindings", {
      method: "POST",
      token: login.body.token,
      body: { repositoryUrl: sampleRepoRoot, branch: "main" }
    });
    const created = await request(app, "/projects/prj-retail-orders/extraction-jobs", {
      method: "POST",
      token: login.body.token,
      body: { adapterBindingId: binding.body.binding.id }
    });
    assert.equal(created.body.job.status, "failed");
    assert.equal(created.body.job.diagnostics[0].code, "extraction-failed");
  });
});

test("viewer cannot create extraction jobs", async () => {
  await withAdapter(scopedValidAdapterPayload(), async (adapterUrl) => {
    const app = createTestCoreApp(adapterUrl);
    const login = await request(app, "/auth/login", {
      method: "POST",
      body: { email: "viewer@semantic-prism.local", password: "semantic-prism" }
    });
    const response = await request(app, "/projects/prj-retail-orders/extraction-jobs", {
      method: "POST",
      token: login.body.token
    });
    assert.equal(response.status, 403);
  });
});
