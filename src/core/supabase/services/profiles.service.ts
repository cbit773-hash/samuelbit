// ============================================================
// INVESPRO — Servicio de Perfiles (Supabase)
// ============================================================
import { supabase } from '../client';
import type { Profile, ProfileUpdate, UserRole } from '../database.types';

/** Obtener el perfil del usuario autenticado */
export async function getMyProfile(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) { console.error('[Profiles] Error fetching my profile:', error); return null; }
  return data as Profile;
}

/** Obtener perfil por ID */
export async function getProfileById(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) { console.error('[Profiles] Error fetching profile:', error); return null; }
  return data as Profile;
}

/** Obtener todos los perfiles (Alta Dirección) */
export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) { console.error('[Profiles] Error fetching all profiles:', error); return []; }
  return (data || []) as Profile[];
}

/** Obtener perfiles por rol */
export async function getProfilesByRole(role: UserRole): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', role)
    .order('full_name');

  if (error) { console.error('[Profiles] Error fetching by role:', error); return []; }
  return (data || []) as Profile[];
}

/** Obtener perfiles por equipo */
export async function getProfilesByTeam(teamId: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('team_id', teamId)
    .order('full_name');

  if (error) { console.error('[Profiles] Error fetching by team:', error); return []; }
  return (data || []) as Profile[];
}

/** Actualizar perfil */
export async function updateProfile(id: string, updates: ProfileUpdate): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) { console.error('[Profiles] Error updating profile:', error); return null; }
  return data as Profile;
}

/** Contar perfiles por rol (para KPIs del HEAD) */
export async function countProfilesByRole(): Promise<Record<UserRole, number>> {
  const profiles = await getAllProfiles();
  const counts: Record<string, number> = {
    CLIENT: 0, AGENT: 0, TEAM_LEADER: 0, FLOOR_MANAGER: 0, MANAGER: 0, CHIEF: 0, HEAD: 0
  };
  profiles.forEach(p => { counts[p.role] = (counts[p.role] || 0) + 1; });
  return counts as Record<UserRole, number>;
}
