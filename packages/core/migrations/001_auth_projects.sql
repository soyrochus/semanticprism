create table users (
  id text primary key,
  email text not null unique,
  display_name text not null,
  password_hash text not null,
  roles text[] not null,
  created_at timestamptz not null default now()
);

create table projects (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table project_memberships (
  user_id text not null references users(id) on delete cascade,
  project_id text not null references projects(id) on delete cascade,
  role text not null check (role in ('admin', 'project-owner', 'analyst', 'viewer')),
  created_at timestamptz not null default now(),
  primary key (user_id, project_id)
);
