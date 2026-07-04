# Agent Notes

- Use Podman as the local container runtime for this repository. Prefer `podman compose ...` for the R1 local stack and Compose verification.
- `podman compose` requires a Compose provider such as `podman-compose` or `docker-compose` on `PATH`. If `podman compose` reports "looking up compose provider failed", install/configure the provider before marking Compose-based verification tasks complete.
- Keep Docker-compatible files such as `docker-compose.yml` and `Dockerfile.*` unless a task explicitly requires renaming them; Podman can consume this format.
