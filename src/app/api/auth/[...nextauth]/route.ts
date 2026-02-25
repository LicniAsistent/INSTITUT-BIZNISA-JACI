import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { ROLE_LEVELS } from '@/lib/roles';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          roleLevel: user.roleLevel,
          rank: user.rank,
          xp: user.xp,
          verified: user.verified,
          subscriptionStatus: user.subscriptionStatus,
          avatar: user.avatar,
          canManageChannels: user.canManageChannels,
          canCreateChannel: user.canCreateChannel,
          canAccessAllChannels: user.canAccessAllChannels,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nickname = user.nickname;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.roleLevel = user.roleLevel || ROLE_LEVELS[user.role] || 1;
        token.rank = user.rank;
        token.xp = user.xp;
        token.verified = user.verified;
        token.subscriptionStatus = user.subscriptionStatus;
        token.avatar = user.avatar;
        token.canManageChannels = user.canManageChannels;
        token.canCreateChannel = user.canCreateChannel;
        token.canAccessAllChannels = user.canAccessAllChannels;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.nickname = token.nickname as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.role = token.role as string;
        session.user.roleLevel = token.roleLevel as number;
        session.user.rank = token.rank as number;
        session.user.xp = token.xp as number;
        session.user.verified = token.verified as boolean;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
        session.user.avatar = token.avatar as string;
        session.user.canManageChannels = token.canManageChannels as boolean;
        session.user.canCreateChannel = token.canCreateChannel as boolean;
        session.user.canAccessAllChannels = token.canAccessAllChannels as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };
