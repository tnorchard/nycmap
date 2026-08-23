create table if not exists nycmap_site_stats (
  id int primary key default 1 check (id = 1),
  total_visitors bigint not null default 0
);

insert into nycmap_site_stats (id, total_visitors)
values (1, 0)
on conflict (id) do nothing;

create table if not exists nycmap_presence (
  visitor_id text primary key,
  last_seen timestamptz not null default now()
);

create index if not exists nycmap_presence_last_seen_idx on nycmap_presence (last_seen);

alter table nycmap_site_stats enable row level security;
alter table nycmap_presence enable row level security;
