import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

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
          rank: user.rank,
          xp: user.xp,
          verified: user.verified,
          subscriptionStatus: user.subscriptionStatus,
          avatar: user.avatar,
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
        token.rank = user.rank;
        token.xp = user.xp;
        token.verified = user.verified;
        token.subscriptionStatus = user.subscriptionStatus;
        token.avatar = user.avatar;
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
        session.user.rank = token.rank as number;
        session.user.xp = token.xp as number;
        session.user.verified = token.verified as boolean;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
  },
  session: {
    strategy: 'jwt',
  },
});

export { handler as GET, handler as POST };
