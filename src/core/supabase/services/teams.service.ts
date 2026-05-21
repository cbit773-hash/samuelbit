// ============================================================
// INVESPRO — Servicio de Equipos/Mesas (Supabase)
// ============================================================
import { supabase } from '../client';
import type { Team, Profile } from '../database.types';

/** Obtener todas las mesas */
export async function getAllTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('name');

  if (error) { console.error('[Teams] Error fetching teams:', error); return []; }
  return (data || []) as Team[];
}

/** Obtener una mesa por ID */
export async function getTeamById(id: string): Promise<Team | null> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();

  if (error) { console.error('[Teams] Error fetching team:', error); return null; }
  return data as Team;
}

/** Obtener miembros de una mesa */
export async function getTeamMembers(teamId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('team_id', teamId)
    .order('full_name');

  if (error) { console.error('[Teams] Error fetching team members:', error); return []; }
  return (data || []) as Profile[];
}

/** Crear una nueva mesa */
export async function createTeam(name: string, floorManagerId?: string): Promise<Team | null> {
  const { data, error } = await supabase
    .from('teams')
    .insert({ name, floor_manager_id: floorManagerId || null })
    .select()
    .single();

  if (error) { console.error('[Teams] Error creating team:', error); return null; }
  return data as Team;
}

/** Obtener todas las mesas con conteo de miembros */
export async function getTeamsWithCounts(): Promise<(Team & { memberCount: number })[]> {
  const teams = await getAllTeams();
  const profiles = await (async () => {
    const { data } = await supabase.from('profiles').select('team_id');
    return data || [];
  })();

  return teams.map(team => ({
    ...team,
    memberCount: profiles.filter(p => p.team_id === team.id).length,
  }));
}
