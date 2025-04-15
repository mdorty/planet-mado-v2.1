import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from './prisma';
import bcrypt from 'bcrypt';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: {
    createUser: async (user) => {
      const createdUser = await db.user.create({
        data: {
          email: user.email,
          username: user.name || user.email.split('@')[0],
          password: '', // Password will be set via credentials provider if needed
          role: 'user', // Default role for new users
        },
      });
      return {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.username,
        role: createdUser.role,
        emailVerified: null,
      };
    },
    getUser: async (id) => {
      const user = await db.user.findUnique({ where: { id } });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.username,
        role: user.role,
        emailVerified: null,
      };
    },
    getUserByEmail: async (email) => {
      const user = await db.user.findUnique({ where: { email } });
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.username,
        role: user.role,
        emailVerified: null,
      };
    },
    getUserByAccount: async (providerAccount) => {
      // Implement logic if you have a table linking providers to users
      return null;
    },
    linkAccount: async (account) => {
      // Implement logic to link an account to a user
      return undefined;
    },
    createSession: async (session) => {
      const createdSession = await db.session.create({
        data: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires
        }
      });
      return {
        sessionToken: createdSession.sessionToken,
        userId: createdSession.userId,
        expires: createdSession.expires
      };
    },
    getSessionAndUser: async (sessionToken) => {
      const session = await db.session.findUnique({
        where: { sessionToken },
        include: { user: true }
      });
      if (!session) return null;
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires
        },
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.username,
          role: session.user.role,
          emailVerified: null
        }
      };
    },
    updateSession: async (session) => {
      const updatedSession = await db.session.update({
        where: { sessionToken: session.sessionToken },
        data: {
          expires: session.expires
        }
      });
      return {
        sessionToken: updatedSession.sessionToken,
        userId: updatedSession.userId,
        expires: updatedSession.expires
      };
    },
    deleteSession: async (sessionToken) => {
      await db.session.delete({
        where: { sessionToken }
      });
      return undefined;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const email = credentials.email as string;
        const passwordInput = credentials.password as string;
        const user = await db.user.findUnique({
          where: { email: email },
        });
        if (!user || !user.password) {
          return null;
        }
        const password = user.password as string;
        const isValid = await bcrypt.compare(passwordInput, password);
        if (!isValid) {
          return null;
        }
        return { id: user.id, email: user.email, name: user.username, role: user.role };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});