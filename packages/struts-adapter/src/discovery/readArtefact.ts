import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join, normalize } from "node:path";

export async function readArtefact(repositoryRoot: string, path: string) {
  const normalized = normalize(path);
  if (normalized.startsWith("..")) {
    throw new Error("Path escapes repository root");
  }
  const content = await readFile(join(repositoryRoot, normalized), "utf8");
  return {
    path,
    content,
    language: inferLanguage(path),
    encoding: "utf-8",
    contentHash: createHash("sha256").update(content).digest("hex")
  };
}

function inferLanguage(path: string) {
  if (path.endsWith(".java")) return "java";
  if (path.endsWith(".jsp")) return "jsp";
  if (path.endsWith(".xml")) return "xml";
  if (path.endsWith(".properties")) return "properties";
  if (path.endsWith(".sql")) return "sql";
  return "text";
}
