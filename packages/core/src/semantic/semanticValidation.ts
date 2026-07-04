import type {
  AdapterSemanticPayload,
  ProvenanceRecord,
  SemanticObject,
  SemanticRelationship
} from "@semantic-prism/shared-contracts";
import { isCanonicalObjectKind, isRelationshipKind } from "@semantic-prism/shared-contracts";

export interface SemanticValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateSemanticPayload(payload: AdapterSemanticPayload): SemanticValidationResult {
  const errors: string[] = [];
  const objectIds = new Set<string>();
  const provenanceByObject = new Map<string, ProvenanceRecord[]>();

  for (const provenance of payload.provenance) {
    const existing = provenanceByObject.get(provenance.semanticObjectId) ?? [];
    existing.push(provenance);
    provenanceByObject.set(provenance.semanticObjectId, existing);
  }

  for (const object of payload.objects) {
    objectIds.add(object.id);
    validateSemanticObject(object, provenanceByObject, errors);
  }

  for (const relationship of payload.relationships) {
    validateRelationship(relationship, objectIds, errors);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateSemanticObject(
  object: SemanticObject,
  provenanceByObject: Map<string, ProvenanceRecord[]>,
  errors: string[]
) {
  if (!isCanonicalObjectKind(object.kind)) {
    errors.push(`Semantic object ${object.id} uses unsupported kind ${object.kind}`);
  }
  const provenance = provenanceByObject.get(object.id) ?? [];
  if (!object.synthetic && provenance.length === 0) {
    errors.push(`Semantic object ${object.id} is missing provenance`);
  }
  for (const provenanceId of object.provenanceIds) {
    if (!provenance.some((candidate) => candidate.id === provenanceId)) {
      errors.push(`Semantic object ${object.id} references missing provenance ${provenanceId}`);
    }
  }
}

function validateRelationship(relationship: SemanticRelationship, objectIds: Set<string>, errors: string[]) {
  if (!isRelationshipKind(relationship.kind)) {
    errors.push(`Relationship ${relationship.id} uses unsupported kind ${relationship.kind}`);
  }
  if (!objectIds.has(relationship.sourceObjectId)) {
    errors.push(`Relationship ${relationship.id} references missing source object ${relationship.sourceObjectId}`);
  }
  if (!objectIds.has(relationship.targetObjectId)) {
    errors.push(`Relationship ${relationship.id} references missing target object ${relationship.targetObjectId}`);
  }
}
