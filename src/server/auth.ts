import { Awaitable, User, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import axios from 'axios';
import { HOUR_MS } from '../constants';
import envs from '@/envs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('credentials', credentials, envs.baseUrl);
        try {
          const response = await axios.post(
            `${envs.baseUrl}/`,
            {
              email: credentials!.email,
              password: credentials!.password,
            }
          );
          console.log('response', response);
          return {
            token:'token here',
            data: 'user data here',
          } as unknown as Awaitable<User | null>;
        } catch (error) {
          console.log('error', error);
          throw new Error(JSON.stringify((error as any).response.data));
        }
      },
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as any;
      console.log(session.user)
      ;(session as any).token = token.accessToken as any;
      return session;
    },
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.accessToken = user.token;
        token.user = user.data;
      }
      return token;
    },
    async redirect({ url }) {
      return Promise.resolve(url);
    },
    async signIn({ account, profile, user }) {
      console.log('signIn', account, profile, user);
      return true; // Do different verification for other providers that don't have `email_verified`
    },
  },

  pages: {
    signIn: '/login',
    newUser: '/register',
  },
  secret: envs.nextAuthSecret,
  session: {
    strategy: 'jwt',
    maxAge: 5 * HOUR_MS
  },
  jwt: {
    maxAge: 5 * HOUR_MS
  },
};
