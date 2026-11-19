-- Script SQL para ativar o Ranking Global Online no Supabase
-- Cole e execute no Supabase Dashboard -> SQL Editor

create table if not exists public.rankings (
  run_id text primary key,
  edit_token text not null,
  team_name text not null default 'Dream Team',
  power integer not null,
  avg_level numeric(4,1) not null default 1.0,
  ovr integer not null default 0,
  chem integer not null default 0,
  wins integer not null default 0,
  draws integer not null default 0,
  losses integer not null default 0,
  matches_played integer not null default 0,
  stage_name text not null default '',
  is_champion boolean not null default false,
  is_world_champion boolean not null default false,
  difficulty text not null default 'visible',
  formation text not null default '4-3-3',
  roster_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rankings_power_sort_idx
  on public.rankings (power desc, wins desc, avg_level desc, created_at asc);

alter table public.rankings enable row level security;

revoke all on public.rankings from anon, authenticated;

create or replace view public.rankings_public as
select
  run_id,
  team_name,
  power,
  avg_level,
  ovr,
  chem,
  wins,
  draws,
  losses,
  matches_played,
  stage_name,
  is_champion,
  is_world_champion,
  difficulty,
  formation,
  roster_json,
  created_at,
  updated_at
from public.rankings;

grant select on public.rankings_public to anon, authenticated;

create or replace function public.save_ranking_run(
  p_run_id text,
  p_edit_token text,
  p_team_name text,
  p_power integer,
  p_avg_level numeric,
  p_ovr integer,
  p_chem integer,
  p_wins integer,
  p_draws integer,
  p_losses integer,
  p_matches_played integer,
  p_stage_name text,
  p_is_champion boolean,
  p_is_world_champion boolean,
  p_difficulty text,
  p_formation text,
  p_roster_json jsonb
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_token text;
  v_clean_name text;
  v_clean_stage text;
  v_diff text;
  v_form text;
begin
  if p_run_id is null or char_length(p_run_id) < 8 or char_length(p_run_id) > 64 then
    raise exception 'Invalid run_id';
  end if;
  if p_edit_token is null or char_length(p_edit_token) < 8 or char_length(p_edit_token) > 64 then
    raise exception 'Invalid edit_token';
  end if;
  if p_power is null or p_power < 100 or p_power > 30000 then
    raise exception 'Invalid power';
  end if;
  if p_avg_level is null or p_avg_level < 1 or p_avg_level > 30 then
    raise exception 'Invalid avg_level';
  end if;
  if p_ovr is null or p_ovr < 40 or p_ovr > 99 then
    raise exception 'Invalid ovr';
  end if;
  if p_chem is null or p_chem < 0 or p_chem > 100 then
    raise exception 'Invalid chem';
  end if;
  if coalesce(p_wins, -1) < 0 or coalesce(p_draws, -1) < 0 or coalesce(p_losses, -1) < 0
     or (p_wins + p_draws + p_losses) > 15 then
    raise exception 'Invalid match record';
  end if;
  if p_matches_played is null or p_matches_played < 0 or p_matches_played > 15 then
    raise exception 'Invalid matches_played';
  end if;
  if p_roster_json is null or jsonb_typeof(p_roster_json) <> 'array' or jsonb_array_length(p_roster_json) > 11 then
    raise exception 'Invalid roster_json';
  end if;

  v_clean_name := coalesce(nullif(left(btrim(coalesce(p_team_name, '')), 28), ''), 'Dream Team');
  v_clean_stage := left(btrim(coalesce(p_stage_name, '')), 64);
  v_diff := case when p_difficulty = 'hidden' then 'hidden' else 'visible' end;
  v_form := case when p_formation in ('4-3-3', '4-4-2', '3-4-3', '3-5-2') then p_formation else '4-3-3' end;

  select edit_token into v_existing_token
  from public.rankings
  where run_id = p_run_id;

  if found then
    if v_existing_token <> p_edit_token then
      raise exception 'Forbidden edit token';
    end if;

    update public.rankings
    set
      team_name = v_clean_name,
      power = p_power,
      avg_level = p_avg_level,
      ovr = p_ovr,
      chem = p_chem,
      wins = p_wins,
      draws = p_draws,
      losses = p_losses,
      matches_played = p_matches_played,
      stage_name = v_clean_stage,
      is_champion = coalesce(p_is_champion, false),
      is_world_champion = coalesce(p_is_world_champion, false),
      difficulty = v_diff,
      formation = v_form,
      roster_json = p_roster_json,
      updated_at = now()
    where run_id = p_run_id;
  else
    insert into public.rankings (
      run_id, edit_token, team_name, power, avg_level, ovr, chem,
      wins, draws, losses, matches_played, stage_name,
      is_champion, is_world_champion, difficulty, formation, roster_json
    ) values (
      p_run_id, p_edit_token, v_clean_name, p_power, p_avg_level, p_ovr, p_chem,
      p_wins, p_draws, p_losses, p_matches_played, v_clean_stage,
      coalesce(p_is_champion, false), coalesce(p_is_world_champion, false), v_diff, v_form, p_roster_json
    );
  end if;
end;
$$;

grant execute on function public.save_ranking_run(
  text, text, text, integer, numeric, integer, integer, integer, integer, integer, integer, text, boolean, boolean, text, text, jsonb
) to anon, authenticated;

create or replace function public.rename_ranking_run(
  p_run_id text,
  p_edit_token text,
  p_team_name text
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_clean_name text;
begin
  if p_run_id is null or char_length(p_run_id) < 8 or char_length(p_run_id) > 64 then
    return false;
  end if;
  if p_edit_token is null or char_length(p_edit_token) < 8 or char_length(p_edit_token) > 64 then
    return false;
  end if;

  v_clean_name := coalesce(nullif(left(btrim(coalesce(p_team_name, '')), 28), ''), 'Dream Team');

  update public.rankings
  set
    team_name = v_clean_name,
    updated_at = now()
  where run_id = p_run_id
    and edit_token = p_edit_token;

  return found;
end;
$$;

grant execute on function public.rename_ranking_run(text, text, text) to anon, authenticated;
