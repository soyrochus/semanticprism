import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import type { ArtefactRecord, ExtractionDiagnostic } from "@semantic-prism/shared-contracts";

const artefactTypeByName: Array<[RegExp, string, string]> = [
  [/struts-config\.xml$/i, "struts-config", "xml"],
  [/web\.xml$/i, "web-xml", "xml"],
  [/validation.*\.xml$/i, "validation-xml", "xml"],
  [/\.jsp$/i, "jsp-screen", "jsp"],
  [/Action\.java$/i, "struts-action", "java"],
  [/Form\.java$/i, "action-form", "java"],
  [/Service\.java$/i, "service", "java"],
  [/Dao\.java$/i, "dao", "java"],
  [/\.properties$/i, "messages", "properties"],
  [/\.sql$/i, "sql", "sql"],
  [/Test\.java$/i, "test", "java"]
];

async function walk(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

function classify(path: string) {
  return artefactTypeByName.find(([pattern]) => pattern.test(path));
}

export async function discoverArtefacts(input: {
  repositoryRoot: string;
  projectId: string;
  snapshotId: string;
  adapterBindingId: string;
}) {
  const files = await walk(input.repositoryRoot);
  const diagnostics: ExtractionDiagnostic[] = [];
  const artefacts: ArtefactRecord[] = [];

  for (const file of files) {
    const relPath = relative(input.repositoryRoot, file);
    const classification = classify(relPath);
    if (!classification) {
      diagnostics.push({
        level: "info",
        code: "unclassified-artefact",
        message: `Skipped unclassified artefact ${relPath}`,
        artefactPath: relPath
      });
      continue;
    }
    const [, artefactType, language] = classification;
    const content = await readFile(file);
    const stats = await stat(file);
    artefacts.push({
      id: `art-${createHash("sha1").update(relPath).digest("hex").slice(0, 12)}`,
      projectId: input.projectId,
      snapshotId: input.snapshotId,
      adapterBindingId: input.adapterBindingId,
      path: relPath,
      artefactType,
      language,
      contentHash: createHash("sha256").update(content).digest("hex"),
      sizeBytes: stats.size,
      encoding: "utf-8",
      metadata: {}
    });
  }

  return { artefacts, diagnostics };
}
