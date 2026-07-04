import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type {
  AdapterSemanticPayload,
  ArtefactRecord,
  ExtractionDiagnostic,
  ProvenanceRecord,
  SemanticObject,
  SemanticRelationship
} from "@semantic-prism/shared-contracts";

interface ExtractionInput {
  repositoryRoot: string;
  projectId: string;
  snapshotId: string;
  artefacts: ArtefactRecord[];
}

interface ExtractionState {
  input: ExtractionInput;
  objects: SemanticObject[];
  relationships: SemanticRelationship[];
  provenance: ProvenanceRecord[];
  diagnostics: ExtractionDiagnostic[];
  objectIds: Set<string>;
  relationshipIds: Set<string>;
}

export async function extractSemanticObjects(input: ExtractionInput): Promise<AdapterSemanticPayload> {
  const state: ExtractionState = {
    input,
    objects: [],
    relationships: [],
    provenance: [],
    diagnostics: [],
    objectIds: new Set(),
    relationshipIds: new Set()
  };

  const application = addObject(state, {
    id: "obj-application-retail-orders",
    kind: "Application",
    label: "Retail Orders",
    description: "Canonical application object inferred from the Struts project.",
    synthetic: true,
    attributes: { substrate: "java-struts" },
    provenanceIds: []
  });

  for (const artefact of input.artefacts) {
    addArtefactObject(state, artefact, application.id);
  }

  for (const artefact of input.artefacts) {
    try {
      const content = await readFile(join(input.repositoryRoot, artefact.path), "utf8");
      if (artefact.artefactType === "struts-config") {
        parseStrutsConfig(state, artefact, content, application.id);
      } else if (artefact.artefactType === "jsp-screen") {
        parseJsp(state, artefact, content, application.id);
      } else if (artefact.artefactType === "struts-action") {
        parseActionClass(state, artefact, content);
      } else if (artefact.artefactType === "action-form") {
        parseFormClass(state, artefact, content, application.id);
      } else if (artefact.artefactType === "service" || artefact.artefactType === "dao") {
        parseServiceOrDao(state, artefact, content);
      } else if (artefact.artefactType === "validation-xml") {
        parseValidationXml(state, artefact, content);
      } else if (artefact.artefactType === "messages") {
        parseProperties(state, artefact, content);
      }
    } catch (error) {
      state.diagnostics.push({
        level: "error",
        code: "parse-failure",
        message: error instanceof Error ? error.message : "Failed to parse artefact",
        artefactPath: artefact.path
      });
    }
  }

  return {
    objects: state.objects,
    relationships: state.relationships,
    provenance: state.provenance,
    diagnostics: state.diagnostics
  };
}

function addArtefactObject(state: ExtractionState, artefact: ArtefactRecord, applicationId: string) {
  const object = addObject(state, {
    id: `obj-artefact-${artefact.id}`,
    kind: "Artefact",
    label: artefact.path,
    description: `${artefact.artefactType} artefact`,
    attributes: {
      path: artefact.path,
      artefactType: artefact.artefactType,
      language: artefact.language,
      contentHash: artefact.contentHash
    },
    provenanceIds: [`prov-obj-artefact-${artefact.id}`]
  });
  addProvenance(state, object, artefact, "extracted", ["Artefact discovered from repository snapshot"], { startLine: 1, endLine: 1 });
  addRelationship(state, applicationId, object.id, "contains", {});
  return object;
}

function parseStrutsConfig(state: ExtractionState, artefact: ArtefactRecord, content: string, applicationId: string) {
  for (const match of content.matchAll(/<action\s+([^>]+)>/g)) {
    const attrs = parseXmlAttributes(match[1]);
    const actionPath = attrs.path ?? "unknown-action";
    const actionType = attrs.type ?? "";
    const object = addObject(state, {
      id: `obj-struts-action-${slug(actionPath)}`,
      kind: "ApplicationAction",
      label: actionType.split(".").pop() || actionPath,
      description: "Application action mapped from Struts action configuration.",
      attributes: {
        strutsPath: actionPath,
        strutsType: actionType,
        formBean: attrs.name,
        input: attrs.input
      },
      provenanceIds: [`prov-obj-struts-action-${slug(actionPath)}`]
    });
    addProvenance(state, object, artefact, "extracted", [`Struts action mapping ${actionPath}`], lineRange(content, match.index ?? 0));
    addRelationship(state, applicationId, object.id, "contains", {});
  }

  for (const match of content.matchAll(/<form-bean\s+([^/]+)\/>/g)) {
    const attrs = parseXmlAttributes(match[1]);
    const entity = addObject(state, {
      id: `obj-entity-${slug(attrs.name ?? attrs.type ?? "form-bean")}`,
      kind: "Entity",
      label: attrs.name ?? attrs.type ?? "Form Bean",
      description: "Form entity declared in Struts configuration.",
      attributes: { strutsType: attrs.type },
      provenanceIds: [`prov-obj-entity-${slug(attrs.name ?? attrs.type ?? "form-bean")}`]
    });
    addProvenance(state, entity, artefact, "extracted", ["Struts form-bean declaration"], lineRange(content, match.index ?? 0));
    addRelationship(state, applicationId, entity.id, "contains", {});
  }

  const messageResource = /<message-resources\s+parameter="([^"]+)"/.exec(content);
  if (messageResource) {
    state.diagnostics.push({
      level: "info",
      code: "message-resource",
      message: `Struts message resource ${messageResource[1]} detected`,
      artefactPath: artefact.path
    });
  }
}

function parseJsp(state: ExtractionState, artefact: ArtefactRecord, content: string, applicationId: string) {
  const screenLabel = artefact.path.split("/").pop()?.replace(".jsp", "") ?? artefact.path;
  const screen = addObject(state, {
    id: `obj-screen-${artefact.id}`,
    kind: "Screen",
    label: screenLabel,
    description: "Screen discovered from JSP artefact.",
    attributes: { path: artefact.path },
    provenanceIds: [`prov-obj-screen-${artefact.id}`]
  });
  addProvenance(state, screen, artefact, "extracted", ["JSP classified as screen"], { startLine: 1, endLine: Math.max(1, content.split("\n").length) });
  addRelationship(state, applicationId, screen.id, "contains", {});

  const form = /<html:form\s+action="([^"]+)"/.exec(content);
  if (form) {
    const action = addObject(state, {
      id: `obj-user-action-${artefact.id}-${slug(form[1])}`,
      kind: "UserAction",
      label: `Submit ${screenLabel}`,
      description: "User action detected from JSP form submission.",
      attributes: { formAction: form[1], method: "post" },
      provenanceIds: [`prov-obj-user-action-${artefact.id}-${slug(form[1])}`]
    });
    addProvenance(state, action, artefact, "derived", [`JSP form submits to ${form[1]}`], lineRange(content, form.index));
    addRelationship(state, screen.id, action.id, "triggers", {});
    addRelationship(state, action.id, `obj-struts-action-${slug(form[1])}`, "triggers", { via: "struts-action-path" });
  }

  for (const fieldMatch of content.matchAll(/<html:text\s+property="([^"]+)"/g)) {
    const fieldName = fieldMatch[1];
    const field = addObject(state, {
      id: `obj-field-${artefact.id}-${slug(fieldName)}`,
      kind: "Field",
      label: fieldName,
      description: "Input field discovered from JSP.",
      attributes: { property: fieldName },
      provenanceIds: [`prov-obj-field-${artefact.id}-${slug(fieldName)}`]
    });
    addProvenance(state, field, artefact, "extracted", [`JSP input property ${fieldName}`], lineRange(content, fieldMatch.index ?? 0));
    addRelationship(state, screen.id, field.id, "contains", {});
  }
}

function parseActionClass(state: ExtractionState, artefact: ArtefactRecord, content: string) {
  const className = classNameFromPath(artefact.path);
  const action = addObject(state, {
    id: `obj-app-action-${artefact.id}`,
    kind: "ApplicationAction",
    label: className,
    description: "Application action mapped from Java Action class.",
    attributes: { path: artefact.path, substrateClass: className },
    provenanceIds: [`prov-obj-app-action-${artefact.id}`]
  });
  addProvenance(state, action, artefact, "extracted", ["Java class name matched Action pattern"], { startLine: 1, endLine: Math.max(1, content.split("\n").length) });
  addRelationship(state, action.id, `obj-artefact-${artefact.id}`, "implemented-by", {});

  if (/getCreditLimit\(\)/.test(content) && /getOrderTotal\(\)/.test(content)) {
    const rule = addObject(state, {
      id: `obj-business-rule-credit-limit-${artefact.id}`,
      kind: "BusinessRule",
      label: "Order total must not exceed customer credit limit",
      description: "Business rule candidate inferred from Java condition and domain field reads.",
      attributes: { confidenceReason: "Detected order total comparison against customer credit limit" },
      provenanceIds: [`prov-obj-business-rule-credit-limit-${artefact.id}`]
    });
    const index = content.indexOf("getCreditLimit()");
    addProvenance(state, rule, artefact, "derived", ["getOrderTotal compared with getCreditLimit"], lineRange(content, Math.max(0, index)));
    addRelationship(state, action.id, rule.id, "evaluates", {});
    state.diagnostics.push({
      level: "warning",
      code: "business-rule-candidate",
      message: "Credit limit rule is a derived business rule candidate and should be reviewed.",
      artefactPath: artefact.path
    });
  }
}

function parseFormClass(state: ExtractionState, artefact: ArtefactRecord, content: string, applicationId: string) {
  const entity = addObject(state, {
    id: `obj-entity-${slug(classNameFromPath(artefact.path))}`,
    kind: "Entity",
    label: classNameFromPath(artefact.path),
    description: "Form entity mapped from ActionForm-style Java class.",
    attributes: { path: artefact.path },
    provenanceIds: [`prov-obj-entity-${slug(classNameFromPath(artefact.path))}`]
  });
  addProvenance(state, entity, artefact, "extracted", ["Java class name matched Form pattern"], { startLine: 1, endLine: Math.max(1, content.split("\n").length) });
  addRelationship(state, applicationId, entity.id, "contains", {});

  for (const fieldMatch of content.matchAll(/private\s+[\w.<>]+\s+(\w+)\s*;/g)) {
    const field = addObject(state, {
      id: `obj-field-${artefact.id}-${slug(fieldMatch[1])}`,
      kind: "Field",
      label: fieldMatch[1],
      description: "Domain field discovered from form class.",
      attributes: { declaringClass: classNameFromPath(artefact.path) },
      provenanceIds: [`prov-obj-field-${artefact.id}-${slug(fieldMatch[1])}`]
    });
    addProvenance(state, field, artefact, "extracted", [`Java private field ${fieldMatch[1]}`], lineRange(content, fieldMatch.index ?? 0));
    addRelationship(state, entity.id, field.id, "contains", {});
  }
}

function parseServiceOrDao(state: ExtractionState, artefact: ArtefactRecord, content: string) {
  for (const methodMatch of content.matchAll(/public\s+[\w.<>]+\s+(\w+)\s*\(/g)) {
    const operation = addObject(state, {
      id: `obj-data-access-${artefact.id}-${slug(methodMatch[1])}`,
      kind: "DataAccessOperation",
      label: methodMatch[1],
      description: "Data access or service operation detected from Java method.",
      attributes: { className: classNameFromPath(artefact.path), artefactType: artefact.artefactType },
      provenanceIds: [`prov-obj-data-access-${artefact.id}-${slug(methodMatch[1])}`]
    });
    addProvenance(state, operation, artefact, "extracted", [`Java method ${methodMatch[1]}`], lineRange(content, methodMatch.index ?? 0));
    addRelationship(state, operation.id, `obj-artefact-${artefact.id}`, "implemented-by", {});
  }
}

function parseValidationXml(state: ExtractionState, artefact: ArtefactRecord, content: string) {
  for (const fieldMatch of content.matchAll(/<field\s+property="([^"]+)"\s+depends="([^"]+)"/g)) {
    const rule = addObject(state, {
      id: `obj-validation-rule-${artefact.id}-${slug(fieldMatch[1])}`,
      kind: "ValidationRule",
      label: `${fieldMatch[1]} ${fieldMatch[2]}`,
      description: "Validation rule extracted from Struts validation XML.",
      attributes: { property: fieldMatch[1], depends: fieldMatch[2].split(",") },
      provenanceIds: [`prov-obj-validation-rule-${artefact.id}-${slug(fieldMatch[1])}`]
    });
    addProvenance(state, rule, artefact, "extracted", [`Validation depends ${fieldMatch[2]}`], lineRange(content, fieldMatch.index ?? 0));
  }
}

function parseProperties(state: ExtractionState, artefact: ArtefactRecord, content: string) {
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }
    const [key, ...valueParts] = trimmed.split("=");
    const message = addObject(state, {
      id: `obj-message-${artefact.id}-${slug(key)}`,
      kind: "Message",
      label: key,
      description: valueParts.join("="),
      attributes: { key, value: valueParts.join("=") },
      provenanceIds: [`prov-obj-message-${artefact.id}-${slug(key)}`]
    });
    addProvenance(state, message, artefact, "extracted", [`Properties message ${key}`], { startLine: 1, endLine: Math.max(1, content.split("\n").length) });
  }
}

function addObject(
  state: ExtractionState,
  object: Omit<SemanticObject, "projectId" | "snapshotId">
) {
  const fullObject: SemanticObject = {
    ...object,
    projectId: state.input.projectId,
    snapshotId: state.input.snapshotId
  };
  if (!state.objectIds.has(fullObject.id)) {
    state.objects.push(fullObject);
    state.objectIds.add(fullObject.id);
  }
  return fullObject;
}

function addRelationship(
  state: ExtractionState,
  sourceObjectId: string,
  targetObjectId: string,
  kind: SemanticRelationship["kind"],
  attributes: Record<string, unknown>
) {
  const id = `rel-${slug(sourceObjectId)}-${kind}-${slug(targetObjectId)}`;
  if (state.relationshipIds.has(id)) {
    return;
  }
  state.relationshipIds.add(id);
  state.relationships.push({
    id,
    projectId: state.input.projectId,
    snapshotId: state.input.snapshotId,
    sourceObjectId,
    targetObjectId,
    kind,
    attributes
  });
}

function addProvenance(
  state: ExtractionState,
  object: SemanticObject,
  artefact: ArtefactRecord,
  extractionType: ProvenanceRecord["extractionType"],
  evidence: string[],
  sourceRange: ProvenanceRecord["sourceRange"]
) {
  const provenanceId = object.provenanceIds[0] ?? `prov-${object.id}`;
  state.provenance.push({
    id: provenanceId,
    projectId: object.projectId,
    snapshotId: object.snapshotId,
    semanticObjectId: object.id,
    artefactId: artefact.id,
    sourceRange,
    extractionType,
    extractorId: "struts-adapter-r1",
    confidence: extractionType === "derived" ? 0.72 : 0.92,
    evidence
  });
}

function parseXmlAttributes(input: string) {
  return Object.fromEntries([...input.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], match[2]]));
}

function lineRange(content: string, index: number) {
  const before = content.slice(0, index);
  const startLine = before.split("\n").length;
  return { startLine, endLine: startLine };
}

function classNameFromPath(path: string) {
  return path.split("/").pop()?.replace(".java", "") ?? path;
}

function slug(value: string) {
  return value
    .replace(/^\/+/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
