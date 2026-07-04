insert into users (id, email, display_name, password_hash, roles) values
  ('usr-admin', 'admin@semantic-prism.local', 'R1 Admin', 'pbkdf2_sha256$120000$semanticprismr1demo$83dc80caa6be99730e1aadeddc8183840633f24bf3c63ac362a31dc740b00743', array['admin']),
  ('usr-owner', 'owner@semantic-prism.local', 'Project Owner', 'pbkdf2_sha256$120000$semanticprismr1demo$83dc80caa6be99730e1aadeddc8183840633f24bf3c63ac362a31dc740b00743', array['project-owner']),
  ('usr-analyst', 'analyst@semantic-prism.local', 'Business Analyst', 'pbkdf2_sha256$120000$semanticprismr1demo$83dc80caa6be99730e1aadeddc8183840633f24bf3c63ac362a31dc740b00743', array['analyst']),
  ('usr-viewer', 'viewer@semantic-prism.local', 'Read Only Viewer', 'pbkdf2_sha256$120000$semanticprismr1demo$83dc80caa6be99730e1aadeddc8183840633f24bf3c63ac362a31dc740b00743', array['viewer'])
on conflict (id) do nothing;

insert into projects (id, slug, name, description) values
  ('prj-retail-orders', 'retail-orders-struts', 'Retail Orders Struts', 'Stable local sample Struts repository for R1 extraction.')
on conflict (id) do nothing;

insert into project_memberships (user_id, project_id, role) values
  ('usr-admin', 'prj-retail-orders', 'project-owner'),
  ('usr-owner', 'prj-retail-orders', 'project-owner'),
  ('usr-analyst', 'prj-retail-orders', 'analyst'),
  ('usr-viewer', 'prj-retail-orders', 'viewer')
on conflict (user_id, project_id) do nothing;

insert into adapter_definitions (id, adapter_type, display_name, service_endpoint, supported_capabilities, status, version) values
  ('adp-java-struts', 'java-struts', 'Java Struts Adapter', 'http://struts-adapter-service:4100', array['discoverArtefacts', 'readArtefact', 'extractSemanticObjects'], 'active', '0.1.0')
on conflict (id) do nothing;

insert into project_adapter_bindings (id, project_id, adapter_definition_id, repository_url, branch, root_path, credentials_ref, status) values
  ('bind-retail-orders-struts', 'prj-retail-orders', 'adp-java-struts', '/sample-struts-repo', 'main', '.', null, 'ready')
on conflict (id) do nothing;
