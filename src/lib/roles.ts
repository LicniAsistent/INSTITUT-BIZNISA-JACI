// Role permissions and utilities for Institut Biznisa

// ====================
// XP SYSTEM CONFIG (2026-02-24)
// ====================

// Daily XP limit
export const DAILY_XP_LIMIT = 150;

// XP per level (1000 XP each)
export const XP_PER_LEVEL = 1000;

// Subscription period in days
export const SUBSCRIPTION_DAYS = 31;

// Warning days before XP reset
export const WARNING_DAYS = 10;

// Acceleration threshold (70%)
export const ACCELERATION_THRESHOLD = 0.7;

// Rank benefits configuration
export const RANK_BENEFITS: Record<number, {
  name: string;
  icon: string;
  benefits: string[];
  discount: number;
  color: string;
  colorClass: string;
}> = {
  1: {
    name: 'Polaznik',
    icon: '📚',
    benefits: ['Bedž "Polaznik"', 'Istaknuto ime u chatu'],
    discount: 0,
    color: 'gray',
    colorClass: 'from-gray-400 to-gray-600',
  },
  2: {
    name: 'Aktivni učenik',
    icon: '📖',
    benefits: ['Kursivan tekst', 'Boldovan tekst', 'Podvučen tekst'],
    discount: 0,
    color: 'blue',
    colorClass: 'from-blue-400 to-blue-600',
  },
  3: {
    name: 'Pripravnik',
    icon: '🔨',
    benefits: ['5% popust na kurseve', '5% popust na mesečnu članarinu', 'Može kreirati izazove'],
    discount: 5,
    color: 'cyan',
    colorClass: 'from-cyan-400 to-cyan-600',
  },
  4: {
    name: 'Kandidat za biznis',
    icon: '💼',
    benefits: ['Zlatni tekst u postovima', 'Može biti pozvan u admin tim'],
    discount: 5,
    color: 'green',
    colorClass: 'from-green-400 to-green-600',
  },
  5: {
    name: 'Preduzetnik',
    icon: '🚀',
    benefits: ['10% popust na mesečnu članarinu', '10% popust na kurseve', 'Popust na užive događaje', 'Prilika da bude kontaktiran za projekte'],
    discount: 10,
    color: 'yellow',
    colorClass: 'from-yellow-400 to-orange-500',
  },
  6: {
    name: 'Izvrsni direktor',
    icon: '👔',
    benefits: ['Privatni Q&A sesije', 'VIP bedž', '15% popust na sve'],
    discount: 15,
    color: 'orange',
    colorClass: 'from-orange-400 to-red-500',
  },
  7: {
    name: 'Vizionar',
    icon: '💎',
    benefits: ['20% popust na sve', 'Velika šansa za pristup uticajnim ljudima', 'Učešće u odlučivanju (admin panel)'],
    discount: 20,
    color: 'purple',
    colorClass: 'from-purple-400 to-pink-500',
  },
};

// Rank XP thresholds (min XP for each rank)
export const RANK_XP_THRESHOLDS = {
  1: { min: 0, max: 1000 },
  2: { min: 1000, max: 2500 },
  3: { min: 2500, max: 4000 },
  4: { min: 4000, max: 5500 },
  5: { min: 5500, max: 7000 },
  6: { min: 7000, max: 8500 },
  7: { min: 8500, max: 10000 },
};

// Get rank from XP
export function getRankFromXP(xp: number): number {
  if (xp >= 8500) return 7;
  if (xp >= 7000) return 6;
  if (xp >= 5500) return 5;
  if (xp >= 4000) return 4;
  if (xp >= 2500) return 3;
  if (xp >= 1000) return 2;
  return 1;
}

// Get rank progress
export function getRankProgress(xp: number): { current: number; next: number; progress: number; xpToNext: number } {
  const currentRank = getRankFromXP(xp);
  
  if (currentRank >= 7) {
    return { current: 7, next: 7, progress: 100, xpToNext: 0 };
  }
  
  const thresholds = (RANK_XP_THRESHOLDS as any)[currentRank];
  const nextThresholds = (RANK_XP_THRESHOLDS as any)[currentRank + 1];
  const xpInRank = xp - thresholds.min;
  const xpNeeded = thresholds.max - thresholds.min;
  
  return {
    current: currentRank,
    next: currentRank + 1,
    progress: Math.min((xpInRank / xpNeeded) * 100, 100),
    xpToNext: Math.max(0, nextThresholds.min - xp),
  };
}

// Check if can accelerate (70% threshold)
export function canAccelerate(xp: number): boolean {
  const rank = getRankFromXP(xp);
  if (rank >= 7) return false;
  
  const thresholds = (RANK_XP_THRESHOLDS as any)[rank];
  const xpInRank = xp - thresholds.min;
  const xpNeeded = thresholds.max - thresholds.min;
  
  return (xpInRank / xpNeeded) >= ACCELERATION_THRESHOLD;
}

// ====================
// ROLE SYSTEM
// ====================

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
