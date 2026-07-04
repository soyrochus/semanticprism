import { adapterCapabilities, canonicalObjectKinds, relationshipKinds } from "./index.js";

export const semanticObjectSchema = {
  $id: "https://semantic-prism.local/schemas/r1/semantic-object.json",
  type: "object",
  required: ["id", "projectId", "snapshotId", "kind", "label", "attributes", "provenanceIds"],
  properties: {
    id: { type: "string" },
    projectId: { type: "string" },
    snapshotId: { type: "string" },
    kind: { enum: canonicalObjectKinds },
    label: { type: "string" },
    description: { type: "string" },
    synthetic: { type: "boolean" },
    attributes: { type: "object" },
    provenanceIds: { type: "array", items: { type: "string" } }
  }
} as const;

export const semanticRelationshipSchema = {
  $id: "https://semantic-prism.local/schemas/r1/semantic-relationship.json",
  type: "object",
  required: ["id", "projectId", "snapshotId", "sourceObjectId", "targetObjectId", "kind", "attributes"],
  properties: {
    id: { type: "string" },
    projectId: { type: "string" },
    snapshotId: { type: "string" },
    sourceObjectId: { type: "string" },
    targetObjectId: { type: "string" },
    kind: { enum: relationshipKinds },
    attributes: { type: "object" }
  }
} as const;

export const provenanceRecordSchema = {
  $id: "https://semantic-prism.local/schemas/r1/provenance-record.json",
  type: "object",
  required: [
    "id",
    "projectId",
    "snapshotId",
    "semanticObjectId",
    "artefactId",
    "extractionType",
    "extractorId",
    "confidence",
    "evidence"
  ],
  properties: {
    id: { type: "string" },
    projectId: { type: "string" },
    snapshotId: { type: "string" },
    semanticObjectId: { type: "string" },
    artefactId: { type: "string" },
    sourceRange: {
      type: "object",
      required: ["startLine", "endLine"],
      properties: {
        startLine: { type: "number" },
        startColumn: { type: "number" },
        endLine: { type: "number" },
        endColumn: { type: "number" }
      }
    },
    extractionType: { enum: ["extracted", "derived", "ai-inferred", "synthetic"] },
    extractorId: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    evidence: { type: "array", items: { type: "string" } }
  }
} as const;

export const adapterDefinitionSchema = {
  $id: "https://semantic-prism.local/schemas/r1/adapter-definition.json",
  type: "object",
  required: ["id", "adapterType", "displayName", "serviceEndpoint", "supportedCapabilities", "status", "version"],
  properties: {
    id: { type: "string" },
    adapterType: { enum: ["java-struts"] },
    displayName: { type: "string" },
    serviceEndpoint: { type: "string" },
    supportedCapabilities: { type: "array", items: { enum: adapterCapabilities } },
    status: { enum: ["active", "inactive"] },
    version: { type: "string" }
  }
} as const;
