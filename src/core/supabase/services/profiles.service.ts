// ============================================================
// INVESPRO — Servicio de Perfiles (Supabase)
// RLS: solo fila propia. Staff: RPCs staff_* (sin recursión en profiles)
// ============================================================
import { supabase } from '../client';
import type { Profile, ProfileUpdate, UserRole } from '../database.types';

async function currentUserId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function profilePatchJson(updates: ProfileUpdate): Record<string, unknown> {
  const patch: Record<string, unknown> = {};
  if (updates.full_name !== undefined) patch.full_name = updates.full_name;
  if (updates.phone !== undefined) patch.phone = updates.phone;
  if (updates.country !== undefined) patch.country = updates.country;
  if (updates.interest_level !== undefined) patch.interest_level = updates.interest_level;
  if (updates.role !== undefined) patch.role = updates.role;
  if (updates.team_id !== undefined) patch.team_id = updates.team_id;
  return patch;
}

/** Obtener el perfil del usuario autenticado */
export async function getMyProfile(): Promise<Profile | null> {
  const uid = await currentUserId();
  if (!uid) return null;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uid)
    .single();

  if (!error && data) return data as Profile;

  const isMissingRow =
    error?.code === 'PGRST116' ||
    error?.message?.includes('0 rows') ||
    error?.message?.includes('multiple (or no) rows');

  if (isMissingRow || error) {
    const { data: ensured, error: ensureError } = await supabase.rpc('ensure_my_profile');
    if (!ensureError && ensured) return ensured as Profile;

    if (!isMissingRow && error) {
      console.error('[Profiles] Error fetching my profile:', error);
    }
  }

  return null;
}

/** Obtener perfil por ID (propio vía RLS; otro vía RPC staff) */
export async function getProfileById(id: string): Promise<Profile | null> {
  const uid = await currentUserId();
  if (!uid) return null;

  if (id === uid) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('[Profiles] Error fetching profile:', error);
      return null;
    }
    return data as Profile;
  }

  const { data, error } = await supabase.rpc('staff_get_profile', { p_id: id });
  if (error) {
    console.error('[Profiles] Error staff_get_profile:', error);
    return null;
  }
  return (data as Profile) ?? null;
}

/** Listar perfiles (staff management — RPC) */
export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.rpc('staff_list_profiles', {
    p_role: null,
    p_team_id: null,
  });
  if (error) {
    console.error('[Profiles] Error staff_list_profiles:', error);
    return [];
  }
  return (data || []) as Profile[];
}

/** Perfiles por rol (staff — RPC) */
export async function getProfilesByRole(role: UserRole): Promise<Profile[]> {
  const { data, error } = await supabase.rpc('staff_list_profiles', {
    p_role: role,
    p_team_id: null,
  });
  if (error) {
    console.error('[Profiles] Error staff_list_profiles by role:', error);
    return [];
  }
  return (data || []) as Profile[];
}

/** Perfiles por equipo (staff — RPC) */
export async function getProfilesByTeam(teamId: string): Promise<Profile[]> {
  const { data, error } = await supabase.rpc('staff_list_profiles', {
    p_role: null,
    p_team_id: teamId,
  });
  if (error) {
    console.error('[Profiles] Error staff_list_profiles by team:', error);
    return [];
  }
  return (data || []) as Profile[];
}

/** Actualizar perfil (propio vía tabla; otro vía RPC staff) */
export async function updateProfile(id: string, updates: ProfileUpdate): Promise<Profile | null> {
  const uid = await currentUserId();
  if (!uid) return null;

  const patch = profilePatchJson(updates);
  if (Object.keys(patch).length === 0) return getProfileById(id);

  if (id === uid) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('[Profiles] Error updating own profile:', error);
      return null;
    }
    return data as Profile;
  }

  const { data, error } = await supabase.rpc('staff_update_profile', {
    p_id: id,
    p_patch: patch,
  });
  if (error) {
    console.error('[Profiles] Error staff_update_profile:', error);
    return null;
  }
  return (data as Profile) ?? null;
}

/** Contar perfiles por rol (para KPIs del HEAD) */
export async function countProfilesByRole(): Promise<Record<UserRole, number>> {
  const profiles = await getAllProfiles();
  const counts: Record<string, number> = {
    CLIENT: 0,
    AGENT: 0,
    TEAM_LEADER: 0,
    FLOOR_MANAGER: 0,
    MANAGER: 0,
    CHIEF: 0,
    HEAD: 0,
  };
  profiles.forEach((p) => {
    counts[p.role] = (counts[p.role] || 0) + 1;
  });
  return counts as Record<UserRole, number>;
}
