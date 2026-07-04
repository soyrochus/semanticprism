import { discoverArtefacts } from "./discovery/discover.js";
import { readArtefact } from "./discovery/readArtefact.js";
import { extractSemanticObjects } from "./extract/extract.js";
import { createAdapterServer, readJson, sendJson } from "./http.js";

interface RepositoryBody {
  repositoryRoot?: string;
  projectId?: string;
  snapshotId?: string;
  adapterBindingId?: string;
}

export function createStrutsAdapterApp(defaultRepositoryRoot: string) {
  return createAdapterServer({
    "GET /health": (_req, res) => {
      sendJson(res, 200, { service: "struts-adapter-service", status: "ok", time: new Date().toISOString() });
    },
    "POST /discover": async (req, res) => {
      const body = await readJson<RepositoryBody>(req);
      const result = await discoverArtefacts({
        repositoryRoot: body.repositoryRoot ?? defaultRepositoryRoot,
        projectId: body.projectId ?? "prj-retail-orders",
        snapshotId: body.snapshotId ?? "snap-local",
        adapterBindingId: body.adapterBindingId ?? "bind-retail-orders-struts"
      });
      sendJson(res, 200, result);
    },
    "POST /read-artefact": async (req, res) => {
      const body = await readJson<RepositoryBody & { path?: string }>(req);
      const result = await readArtefact(body.repositoryRoot ?? defaultRepositoryRoot, body.path ?? "");
      sendJson(res, 200, result);
    },
    "POST /extract-semantic-objects": async (req, res) => {
      const body = await readJson<RepositoryBody & { artefacts?: never[] }>(req);
      const discovered = body.artefacts
        ? { artefacts: body.artefacts, diagnostics: [] }
        : await discoverArtefacts({
            repositoryRoot: body.repositoryRoot ?? defaultRepositoryRoot,
            projectId: body.projectId ?? "prj-retail-orders",
            snapshotId: body.snapshotId ?? "snap-local",
            adapterBindingId: body.adapterBindingId ?? "bind-retail-orders-struts"
          });
      const repositoryRoot = body.repositoryRoot ?? defaultRepositoryRoot;
      const payload = await extractSemanticObjects({
        repositoryRoot,
        projectId: body.projectId ?? "prj-retail-orders",
        snapshotId: body.snapshotId ?? "snap-local",
        artefacts: discovered.artefacts
      });
      sendJson(res, 200, {
        ...payload,
        diagnostics: [...discovered.diagnostics, ...payload.diagnostics]
      });
    },
    "POST /generate-artefact-diff": (_req, res) => {
      sendUnsupported(res, "generateArtefactDiff");
    },
    "POST /run-validation": (_req, res) => {
      sendUnsupported(res, "runValidation");
    },
    "POST /apply-change-set": (_req, res) => {
      sendUnsupported(res, "applyChangeSet");
    },
    "POST /invoke-runtime": (_req, res) => {
      sendUnsupported(res, "invokeRuntime");
    }
  });
}

function sendUnsupported(res: Parameters<typeof sendJson>[0], capability: string) {
  sendJson(res, 400, {
    error: {
      code: "unsupported_capability",
      message: `${capability} is not supported by the R1 Struts adapter`
    }
  });
}
