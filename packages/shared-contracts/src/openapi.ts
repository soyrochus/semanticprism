export const r1OpenApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Semantic Prism Core R1 API",
    version: "0.1.0"
  },
  paths: {
    "/health": {
      get: {
        responses: {
          "200": {
            description: "Core service health"
          }
        }
      }
    },
    "/auth/login": {
      post: {
        responses: {
          "200": { description: "JWT session" },
          "401": { description: "Invalid credentials" }
        }
      }
    },
    "/auth/logout": {
      post: {
        responses: {
          "204": { description: "Client may discard token" }
        }
      }
    },
    "/auth/me": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Current authenticated user" },
          "401": { description: "Missing or invalid token" }
        }
      }
    },
    "/projects": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Assigned projects" },
          "401": { description: "Missing or invalid token" }
        }
      }
    },
    "/projects/{projectId}": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Project detail" },
          "403": { description: "Project membership required" }
        }
      }
    },
    "/admin/users": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Admin user list" },
          "403": { description: "Admin role required" }
        }
      },
      post: {
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Created local R1 user" },
          "403": { description: "Admin role required" }
        }
      }
    },
    "/admin/projects": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Admin project list" },
          "403": { description: "Admin role required" }
        }
      },
      post: {
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Created project" },
          "403": { description: "Admin role required" }
        }
      }
    },
    "/admin/projects/{projectId}/memberships": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Project memberships" },
          "403": { description: "Admin role required" }
        }
      },
      post: {
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Assigned project membership" },
          "403": { description: "Admin role required" }
        }
      }
    },
    "/projects/{projectId}/status": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Project status" },
          "403": { description: "Project membership required" }
        }
      }
    },
    "/projects/{projectId}/adapter-bindings": {
      get: { responses: { "200": { description: "Project adapter bindings" } } },
      post: { responses: { "201": { description: "Created adapter binding" }, "403": { description: "Owner/admin required" } } }
    },
    "/projects/{projectId}/unsupported-capability": {
      post: {
        responses: {
          "400": { description: "Capability rejected in R1" }
        }
      }
    },
    "/projects/{projectId}/snapshots": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Repository snapshots" },
          "403": { description: "Project membership required" }
        }
      },
      post: {
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Created repository snapshot and artefact catalogue" },
          "403": { description: "Project owner or admin required" }
        }
      }
    },
    "/projects/{projectId}/artefacts": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Artefact catalogue" },
          "403": { description: "Project membership required" }
        }
      }
    },
    "/projects/{projectId}/artefacts/{artefactId}": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Artefact metadata" },
          "403": { description: "Project membership required" },
          "404": { description: "Artefact not found" }
        }
      }
    },
    "/projects/{projectId}/artefacts/{artefactId}/content": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Read-only artefact content" },
          "409": { description: "Repository drift detected" }
        }
      }
    },
    "/projects/{projectId}/extraction-jobs": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Project extraction jobs" },
          "403": { description: "Project membership required" }
        }
      },
      post: {
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Created extraction job" },
          "403": { description: "Project owner, analyst, or admin required" }
        }
      }
    },
    "/projects/{projectId}/extraction-jobs/{jobId}": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Extraction job detail" },
          "404": { description: "Extraction job not found" }
        }
      }
    },
    "/projects/{projectId}/objects": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Canonical semantic objects grouped by kind" },
          "403": { description: "Project membership required" }
        }
      }
    },
    "/projects/{projectId}/objects/{objectId}": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Semantic object detail" },
          "404": { description: "Semantic object not found" }
        }
      }
    },
    "/projects/{projectId}/objects/{objectId}/related": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Related semantic objects and relationships" }
        }
      }
    },
    "/projects/{projectId}/subgraph": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Canonical graph nodes and edges" }
        }
      }
    },
    "/projects/{projectId}/search": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Semantic object search results" }
        }
      }
    },
    "/projects/{projectId}/provenance/{objectId}": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Object provenance records" }
        }
      }
    },
    "/projects/{projectId}/source-trace/{objectId}": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Object source trace records" }
        }
      }
    },
    "/projects/{projectId}/workspace-layouts/{workspaceId}": {
      get: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Workspace layout" }
        }
      },
      put: {
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Saved workspace layout" }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
} as const;
