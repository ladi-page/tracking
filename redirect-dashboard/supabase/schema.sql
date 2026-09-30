create extension if not exists pgcrypto;
create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  destination_url text not null,
  is_active boolean not null default true,
  clicks bigint not null default 0,
  created_at timestamptz not null default now()
);

alter table public.redirects enable row level security;

create policy "authenticated users can read redirects"
on public.redirects for select to authenticated using (true);
create policy "authenticated users can insert redirects"
on public.redirects for insert to authenticated with check (true);
create policy "authenticated users can update redirects"
on public.redirects for update to authenticated using (true) with check (true);
create policy "authenticated users can delete redirects"
on public.redirects for delete to authenticated using (true);

create or replace function public.increment_redirect_click(redirect_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.redirects set clicks = clicks + 1 where id = redirect_id and is_active = true;
$$;
revoke all on function public.increment_redirect_click(uuid) from public;
grant execute on function public.increment_redirect_click(uuid) to service_role;
