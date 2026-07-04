create table semantic_objects (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  snapshot_id text not null references repository_snapshots(id) on delete cascade,
  kind text not null,
  label text not null,
  description text,
  synthetic boolean not null default false,
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table semantic_relationships (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  snapshot_id text not null references repository_snapshots(id) on delete cascade,
  source_object_id text not null references semantic_objects(id) on delete cascade,
  target_object_id text not null references semantic_objects(id) on delete cascade,
  kind text not null,
  attributes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table provenance_records (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  snapshot_id text not null references repository_snapshots(id) on delete cascade,
  semantic_object_id text not null references semantic_objects(id) on delete cascade,
  artefact_id text not null references artefacts(id),
  source_range jsonb,
  extraction_type text not null check (extraction_type in ('extracted', 'derived', 'ai-inferred', 'synthetic')),
  extractor_id text not null,
  confidence numeric not null check (confidence >= 0 and confidence <= 1),
  evidence text[] not null,
  created_at timestamptz not null default now()
);

create index semantic_objects_project_snapshot_idx on semantic_objects(project_id, snapshot_id);
create index semantic_relationships_project_snapshot_idx on semantic_relationships(project_id, snapshot_id);
create index provenance_records_object_idx on provenance_records(semantic_object_id);
