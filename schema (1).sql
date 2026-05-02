-- ARK — Full Schema
-- Run this once in Supabase SQL Editor on a fresh project

-- ====== TABLES ======

create table agents (
  id text primary key,
  name text not null,
  role text not null,
  status text default 'idle',
  current_task text,
  last_active timestamptz,
  config jsonb
);

create table thought_logs (
  id uuid primary key default gen_random_uuid(),
  agent_id text references agents(id),
  thought text not null,
  thought_type text default 'reasoning',
  created_at timestamptz default now()
);
create index on thought_logs(created_at desc);

create table athena_reports (
  id uuid primary key default gen_random_uuid(),
  report_type text not null,
  title text not null,
  detail jsonb not null,
  confidence_score float,
  priority text default 'medium',
  actioned boolean default false,
  created_at timestamptz default now()
);

create table apollo_outputs (
  id uuid primary key default gen_random_uuid(),
  output_type text not null,
  title text not null,
  content text,
  quality_score float,
  target_keywords text[],
  status text default 'draft',
  pipeline text,
  distribution_url text,
  approved_at timestamptz,
  distributed_at timestamptz,
  created_at timestamptz default now()
);

create table approval_queue (
  id uuid primary key default gen_random_uuid(),
  requesting_agent text,
  action_type text not null,
  action_detail jsonb not null,
  risk_tier integer not null,
  aegis_assessment text,
  status text default 'pending',
  operator_note text,
  created_at timestamptz default now(),
  expires_at timestamptz default now() + interval '48 hours',
  resolved_at timestamptz
);

create table agent_messages (
  id uuid primary key default gen_random_uuid(),
  from_agent text,
  to_agent text,
  message_type text not null,
  payload jsonb not null,
  priority text default 'normal',
  status text default 'pending',
  created_at timestamptz default now()
);

create table revenue_events (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  event_type text not null,
  amount decimal(10,2) not null,
  currency text default 'USD',
  pipeline text,
  raw_data jsonb,
  created_at timestamptz default now()
);

create table argus_signals (
  id uuid primary key default gen_random_uuid(),
  signal_type text not null,
  pipeline text,
  detail text not null,
  recommended_action text,
  actioned boolean default false,
  created_at timestamptz default now()
);

create table security_log (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  agent_id text,
  rule_triggered text,
  detail text not null,
  severity text not null,
  created_at timestamptz default now()
);

create table eod_reports (
  id uuid primary key default gen_random_uuid(),
  report_date date not null unique,
  content text not null,
  revenue_today decimal(10,2) default 0,
  revenue_week decimal(10,2) default 0,
  revenue_month decimal(10,2) default 0,
  created_at timestamptz default now()
);

create table operator_directives (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  addressed_to text default 'ares',
  status text default 'pending',
  ares_response text,
  created_at timestamptz default now()
);

create table operator_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- ====== SEED DATA ======

insert into agents (id, name, role, status) values
  ('ares',   'ARES',   'Commander & Distribution', 'idle'),
  ('athena', 'ATHENA', 'Intelligence',              'idle'),
  ('apollo', 'APOLLO', 'Creation',                  'idle'),
  ('argus',  'ARGUS',  'Analytics',                 'idle'),
  ('aegis',  'AEGIS',  'Security',                  'idle');

insert into operator_settings (key, value) values
  ('niches', '["AI productivity tools", "no-code automation", "freelancer workflows"]'),
  ('tone',   '"informative, direct, slightly technical, no fluff"'),
  ('email_alerts', '"critical_only"');

-- ====== RLS ======

alter table agents              enable row level security;
alter table thought_logs        enable row level security;
alter table athena_reports      enable row level security;
alter table apollo_outputs      enable row level security;
alter table approval_queue      enable row level security;
alter table agent_messages      enable row level security;
alter table revenue_events      enable row level security;
alter table argus_signals       enable row level security;
alter table security_log        enable row level security;
alter table eod_reports         enable row level security;
alter table operator_directives enable row level security;
alter table operator_settings   enable row level security;

create policy "operator_all" on agents              for all to authenticated using (true) with check (true);
create policy "operator_all" on thought_logs        for all to authenticated using (true) with check (true);
create policy "operator_all" on athena_reports      for all to authenticated using (true) with check (true);
create policy "operator_all" on apollo_outputs      for all to authenticated using (true) with check (true);
create policy "operator_all" on approval_queue      for all to authenticated using (true) with check (true);
create policy "operator_all" on agent_messages      for all to authenticated using (true) with check (true);
create policy "operator_all" on revenue_events      for all to authenticated using (true) with check (true);
create policy "operator_all" on argus_signals       for all to authenticated using (true) with check (true);
create policy "operator_all" on security_log        for all to authenticated using (true) with check (true);
create policy "operator_all" on eod_reports         for all to authenticated using (true) with check (true);
create policy "operator_all" on operator_directives for all to authenticated using (true) with check (true);
create policy "operator_all" on operator_settings   for all to authenticated using (true) with check (true);

-- ====== REALTIME ======

do $$
begin
  begin alter publication supabase_realtime add table thought_logs;
  exception when others then null; end;
  begin alter publication supabase_realtime add table agents;
  exception when others then null; end;
  begin alter publication supabase_realtime add table approval_queue;
  exception when others then null; end;
  begin alter publication supabase_realtime add table revenue_events;
  exception when others then null; end;
end $$;

-- ====== VERIFY — you should see 12 rows ======
select tablename, policyname
from pg_policies
where schemaname = 'public'
order by tablename;
