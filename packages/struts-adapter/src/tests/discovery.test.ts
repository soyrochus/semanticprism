import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { createStrutsAdapterApp } from "../app.js";
import { discoverArtefacts } from "../discovery/discover.js";
import { readArtefact } from "../discovery/readArtefact.js";
import { extractSemanticObjects } from "../extract/extract.js";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../../../../sample-struts-repo");

test("discovers Struts, JSP, Java, and properties artefacts", async () => {
  const result = await discoverArtefacts({
    repositoryRoot: repoRoot,
    projectId: "prj-retail-orders",
    snapshotId: "snap-test",
    adapterBindingId: "bind-retail-orders-struts"
  });
  assert(result.artefacts.some((artefact) => artefact.artefactType === "struts-config"));
  assert(result.artefacts.some((artefact) => artefact.artefactType === "jsp-screen"));
  assert(result.artefacts.some((artefact) => artefact.artefactType === "struts-action"));
});

test("maps artefacts to canonical semantic objects with provenance", async () => {
  const result = await discoverArtefacts({
    repositoryRoot: repoRoot,
    projectId: "prj-retail-orders",
    snapshotId: "snap-test",
    adapterBindingId: "bind-retail-orders-struts"
  });
  const payload = await extractSemanticObjects({
    repositoryRoot: repoRoot,
    projectId: "prj-retail-orders",
    snapshotId: "snap-test",
    artefacts: result.artefacts
  });
  assert(payload.objects.some((object) => object.kind === "Screen"));
  assert(payload.objects.some((object) => object.kind === "ApplicationAction"));
  assert(payload.provenance.length > 0);
  assert.equal(payload.objects.filter((object) => !object.synthetic).every((object) => object.provenanceIds.length > 0), true);
});

test("reads artefacts without modifying content and returns hash metadata", async () => {
  const result = await readArtefact(repoRoot, "src/main/webapp/WEB-INF/jsp/order.jsp");
  assert.equal(result.language, "jsp");
  assert.equal(result.encoding, "utf-8");
  assert.match(result.content, /html:form/);
  assert.equal(result.contentHash.length, 64);
});

test("extracts Struts flow, validation, messages, data access, and business rule candidates", async () => {
  const result = await discoverArtefacts({
    repositoryRoot: repoRoot,
    projectId: "prj-retail-orders",
    snapshotId: "snap-test",
    adapterBindingId: "bind-retail-orders-struts"
  });
  const payload = await extractSemanticObjects({
    repositoryRoot: repoRoot,
    projectId: "prj-retail-orders",
    snapshotId: "snap-test",
    artefacts: result.artefacts
  });

  assert(payload.objects.some((object) => object.kind === "UserAction"));
  assert(payload.objects.some((object) => object.kind === "ValidationRule"));
  assert(payload.objects.some((object) => object.kind === "BusinessRule"));
  assert(payload.objects.some((object) => object.kind === "Entity"));
  assert(payload.objects.some((object) => object.kind === "Field"));
  assert(payload.objects.some((object) => object.kind === "DataAccessOperation"));
  assert(payload.objects.some((object) => object.kind === "Message"));
  assert(payload.objects.some((object) => object.kind === "Artefact"));
  assert(payload.relationships.some((relationship) => relationship.kind === "triggers"));
  assert(payload.relationships.some((relationship) => relationship.kind === "implemented-by"));
  assert(payload.diagnostics.some((diagnostic) => diagnostic.code === "business-rule-candidate"));
  assert.equal(payload.objects.filter((object) => !object.synthetic).every((object) => object.provenanceIds.length > 0), true);
});

test("unsupported adapter capabilities are rejected", async () => {
  const server = createStrutsAdapterApp(repoRoot).listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert(address && typeof address === "object");
  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/run-validation`, { method: "POST" });
    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.error.code, "unsupported_capability");
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
});
