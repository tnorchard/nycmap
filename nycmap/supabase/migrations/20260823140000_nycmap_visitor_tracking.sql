create table if not exists nycmap_visitors (
  visitor_id text primary key,
  first_seen timestamptz not null default now()
);

create index if not exists nycmap_visitors_first_seen_idx on nycmap_visitors (first_seen);

alter table nycmap_visitors enable row level security;

create or replace function nycmap_register_visitor(p_visitor_id text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_id text;
  next_total bigint;
begin
  insert into nycmap_visitors (visitor_id)
  values (p_visitor_id)
  on conflict (visitor_id) do nothing
  returning visitor_id into new_id;

  if new_id is not null then
    insert into nycmap_site_stats (id, total_visitors)
    values (1, 1)
    on conflict (id) do update
      set total_visitors = nycmap_site_stats.total_visitors + 1
    returning total_visitors into next_total;

    return next_total;
  end if;

  select total_visitors into next_total from nycmap_site_stats where id = 1;
  return coalesce(next_total, 0);
end;
$$;

grant execute on function nycmap_register_visitor(text) to service_role;
grant all on table nycmap_visitors to service_role;

notify pgrst, 'reload schema';
