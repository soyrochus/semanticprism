import assert from "node:assert/strict";
import { test } from "node:test";
import type { AdapterSemanticPayload } from "@semantic-prism/shared-contracts";
import { validateSemanticPayload } from "../semantic/semanticValidation.js";

const validPayload: AdapterSemanticPayload = {
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
      id: "rel-triggers",
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
      artefactId: "art-order-jsp",
      extractionType: "extracted",
      extractorId: "test",
      confidence: 0.95,
      evidence: ["JSP screen"]
    },
    {
      id: "prov-action",
      projectId: "prj-retail-orders",
      snapshotId: "snap-test",
      semanticObjectId: "obj-action",
      artefactId: "art-action-java",
      extractionType: "extracted",
      extractorId: "test",
      confidence: 0.95,
      evidence: ["Action class"]
    }
  ],
  diagnostics: []
};

test("accepts canonical object kinds and constrained relationship kinds", () => {
  const result = validateSemanticPayload(validPayload);
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test("rejects substrate-specific semantic object kinds", () => {
  const payload: AdapterSemanticPayload = structuredClone(validPayload);
  payload.objects[0].kind = "StrutsAction" as never;
  const result = validateSemanticPayload(payload);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /unsupported kind StrutsAction/);
});

test("rejects relationship kinds outside the R1 vocabulary", () => {
  const payload: AdapterSemanticPayload = structuredClone(validPayload);
  payload.relationships[0].kind = "struts-forwards-to" as never;
  const result = validateSemanticPayload(payload);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /unsupported kind struts-forwards-to/);
});

test("rejects non-synthetic semantic objects without provenance", () => {
  const payload: AdapterSemanticPayload = structuredClone(validPayload);
  payload.provenance = payload.provenance.filter((provenance) => provenance.semanticObjectId !== "obj-screen");
  const result = validateSemanticPayload(payload);
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /obj-screen is missing provenance/);
});

test("allows synthetic semantic objects without provenance", () => {
  const payload: AdapterSemanticPayload = structuredClone(validPayload);
  payload.objects[0].synthetic = true;
  payload.objects[0].provenanceIds = [];
  payload.provenance = payload.provenance.filter((provenance) => provenance.semanticObjectId !== "obj-screen");
  const result = validateSemanticPayload(payload);
  assert.equal(result.valid, true);
});
