// Role permissions and utilities for Institut Biznisa

// Role hierarchy levels (higher = more permissions)
export const ROLE_LEVELS: Record<string, number> = {
  'founder': 10,
  'visionLead': 9,
  'executiveBoard': 8,
  'admin': 7,
  'edukator': 6,
  'professor': 5,
  'moderator': 4,
  'supportLead': 3,
  'supportAgent': 2,
  'user': 1,
};

// Role display names
export const ROLE_NAMES: Record<string, string> = {
  'founder': 'Founder',
  'visionLead': 'Vision Lead',
  'executiveBoard': 'Executive Board',
  'admin': 'Admin',
  'edukator': 'Edukator',
  'professor': 'Profesor',
  'moderator': 'Moderator',
  'supportLead': 'Support Lead',
  'supportAgent': 'Support Agent',
  'user': 'Korisnik',
};

// Role colors for UI
export const ROLE_COLORS: Record<string, string> = {
  'founder': 'text-yellow-400',
  'visionLead': 'text-yellow-300',
  'executiveBoard': 'text-orange-400',
  'admin': 'text-red-400',
  'edukator': 'text-blue-400',
  'professor': 'text-purple-400',
  'moderator': 'text-green-400',
  'supportLead': 'text-cyan-400',
  'supportAgent': 'text-slate-400',
  'user': 'text-slate-300',
};

// Rank names
export const RANK_NAMES: Record<number, string> = {
  1: 'Polaznik',
  2: 'Aktivni učenik',
  3: 'Pripravnik',
  4: 'Kandidat za biznis',
  5: 'Preduzetnik',
  6: 'Izvršni direktor',
  7: 'Vizionar',
};

// Rank colors
export const RANK_COLORS: Record<number, string> = {
  1: 'text-gray-400',
  2: 'text-gray-300',
  3: 'text-blue-400',
  4: 'text-green-400',
  5: 'text-yellow-400',
  6: 'text-orange-400',
  7: 'text-yellow-300',
};

// Check if user has required role level
export function hasRoleLevel(userRole: string, requiredLevel: number): boolean {
  const userLevel = ROLE_LEVELS[userRole] || 0;
  return userLevel >= requiredLevel;
}

// Check if user can manage channels
export function canManageChannels(role: string): boolean {
  const level = ROLE_LEVELS[role] || 0;
  return level >= 5; // professor and above
}

// Check if user can create their own channel (professor only)
export function canCreateOwnChannel(role: string): boolean {
  return role === 'professor';
}

// Check if user can access all channels (edukator)
export function canAccessAllChannels(role: string): boolean {
  return role === 'edukator' || hasRoleLevel(role, 7); // edukator or admin+
}

// Check if user can manage users
export function canManageUsers(role: string): boolean {
  return hasRoleLevel(role, 7); // admin and above
}

// Check if user can manage courses
export function canManageCourses(role: string): boolean {
  return hasRoleLevel(role, 6); // edukator and above
}

// Get permissions for a role
export function getPermissions(role: string) {
  return {
    canManageChannels: canManageChannels(role),
    canCreateOwnChannel: canCreateOwnChannel(role),
    canAccessAllChannels: canAccessAllChannels(role),
    canManageUsers: canManageUsers(role),
    canManageCourses: canManageCourses(role),
    roleLevel: ROLE_LEVELS[role] || 0,
  };
}
