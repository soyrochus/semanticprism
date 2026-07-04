import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import { join, normalize, relative } from "node:path";
import type { ArtefactRecord } from "@semantic-prism/shared-contracts";

const artefactTypes: Array<[RegExp, string, string]> = [
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

export async function captureRepositorySnapshot(input: {
  repositoryRoot: string;
  projectId: string;
  snapshotId: string;
  adapterBindingId: string;
}) {
  const files = await walk(input.repositoryRoot);
  const artefacts: ArtefactRecord[] = [];
  const treeHash = createHash("sha256");

  for (const file of files.sort()) {
    const relPath = relative(input.repositoryRoot, file);
    const content = await readFile(file);
    treeHash.update(relPath);
    treeHash.update(content);
    const classification = artefactTypes.find(([pattern]) => pattern.test(relPath));
    if (!classification) {
      continue;
    }
    const [, artefactType, language] = classification;
    const stats = await stat(file);
    artefacts.push({
      id: `art-${createHash("sha1").update(`${input.snapshotId}:${relPath}`).digest("hex").slice(0, 16)}`,
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

  return {
    commitHash: `tree-${treeHash.digest("hex").slice(0, 24)}`,
    artefacts
  };
}

export async function readRepositoryArtefact(repositoryRoot: string, path: string) {
  const normalized = normalize(path);
  if (normalized.startsWith("..") || normalized.startsWith("/")) {
    throw new Error("Path escapes repository root");
  }
  const content = await readFile(join(repositoryRoot, normalized), "utf8");
  return {
    content,
    contentHash: createHash("sha256").update(content).digest("hex")
  };
}

async function walk(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    if (entry.name === ".git") {
      continue;
    }
    const path = join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}
