create table adapter_definitions (
  id text primary key,
  adapter_type text not null,
  display_name text not null,
  service_endpoint text not null,
  supported_capabilities text[] not null,
  status text not null check (status in ('active', 'inactive')),
  version text not null,
  created_at timestamptz not null default now()
);

create table project_adapter_bindings (
  id text primary key,
  project_id text not null references projects(id) on delete cascade,
  adapter_definition_id text not null references adapter_definitions(id),
  repository_url text not null,
  branch text not null,
  root_path text not null default '.',
  credentials_ref text,
  status text not null check (status in ('ready', 'not-ready')),
  created_at timestamptz not null default now()
);

create index project_adapter_bindings_project_idx on project_adapter_bindings(project_id);
