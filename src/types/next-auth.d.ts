import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      nickname?: string;
      firstName?: string;
      lastName?: string;
      role: string;
      rank: number;
      xp: number;
      verified: boolean;
      subscriptionStatus: string;
      avatar?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    nickname?: string;
    firstName?: string;
    lastName?: string;
    role: string;
    rank: number;
    xp: number;
    verified: boolean;
    subscriptionStatus: string;
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    nickname?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    rank?: number;
    xp?: number;
    verified?: boolean;
    subscriptionStatus?: string;
    avatar?: string;
  }
}
