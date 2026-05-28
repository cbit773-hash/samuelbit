import type { Role } from '../../features/auth/store/auth.store';

/** UUIDs de perfiles demo en seed_data.sql (cuando no hay sesi├│n Auth real) */
export const DEMO_PROFILE_IDS: Partial<Record<Role, string>> = {
  HEAD: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  CHIEF: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  MANAGER: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  FLOOR_MANAGER: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
  TEAM_LEADER: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  AGENT: 'f1111111-1111-1111-1111-111111111111',
  CLIENT: 'c1111111-1111-1111-1111-111111111111',
};

export function isDemoUserId(userId: string | undefined): boolean {
  return !!userId?.startsWith('demo-');
}
