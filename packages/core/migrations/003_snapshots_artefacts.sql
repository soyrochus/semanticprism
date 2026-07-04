create table repository_snapshots (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  adapter_binding_id text not null references project_adapter_bindings(id),
  branch text not null,
  commit_hash text not null,
  status text not null check (status in ('created', 'discovering', 'extracted', 'failed')),
  created_by text not null references users(id),
  created_at timestamptz not null default now()
);

create table artefacts (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  snapshot_id text not null references repository_snapshots(id) on delete cascade,
  adapter_binding_id text not null references project_adapter_bindings(id),
  path text not null,
  artefact_type text not null,
  language text not null,
  content_hash text not null,
  size_bytes integer not null,
  encoding text not null default 'utf-8',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (snapshot_id, path)
);

create index artefacts_project_snapshot_idx on artefacts(project_id, snapshot_id);
