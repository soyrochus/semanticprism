create table extraction_jobs (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  snapshot_id text references repository_snapshots(id),
  adapter_binding_id text not null references project_adapter_bindings(id),
  status text not null check (status in ('queued', 'running', 'completed', 'completed-with-warnings', 'failed', 'cancelled')),
  requested_by text not null references users(id),
  object_count integer not null default 0,
  relationship_count integer not null default 0,
  artefact_count integer not null default 0,
  diagnostics jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index extraction_jobs_project_idx on extraction_jobs(project_id, created_at desc);
