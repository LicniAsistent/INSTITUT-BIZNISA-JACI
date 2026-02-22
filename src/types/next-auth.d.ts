import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      nickname: string | null;
      firstName: string | null;
      lastName: string | null;
      role: string;
      roleLevel: number;
      rank: number;
      xp: number;
      verified: boolean;
      subscriptionStatus: string;
      avatar: string | null;
      canManageChannels: boolean;
      canCreateChannel: boolean;
      canAccessAllChannels: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    nickname: string | null;
    firstName: string | null;
    lastName: string | null;
    role: string;
    roleLevel: number;
    rank: number;
    xp: number;
    verified: boolean;
    subscriptionStatus: string;
    avatar: string | null;
    canManageChannels: boolean;
    canCreateChannel: boolean;
    canAccessAllChannels: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    nickname: string | null;
    firstName: string | null;
    lastName: string | null;
    role: string;
    roleLevel: number;
    rank: number;
    xp: number;
    verified: boolean;
    subscriptionStatus: string;
    avatar: string | null;
    canManageChannels: boolean;
    canCreateChannel: boolean;
    canAccessAllChannels: boolean;
  }
}
