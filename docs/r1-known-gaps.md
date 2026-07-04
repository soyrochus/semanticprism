# R1 Known Gaps

- Frontend coverage is currently verified by TypeScript/Vite build and backend contract tests, not by a browser-based frontend test runner. Add Playwright or Vitest coverage for login, project selection, graph selection, source trace, read-only source viewing, disabled controls, and role-specific extraction visibility before treating task 9.12 as complete.
- The R1 core persistence in this implementation pass is an in-memory local-demo store with SQL migrations/seeds present for the target PostgreSQL schema. Wiring the HTTP routes directly to PostgreSQL should be handled before production deployment.
- Java/Struts extraction is deterministic and fixture-oriented. It captures common XML/JSP/Java/properties patterns and emits diagnostics for uncertain business-rule candidates, but it is not a complete Java parser.
