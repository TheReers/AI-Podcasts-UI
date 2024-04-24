import { Awaitable, User, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import axios from 'axios';
import { HOUR_MS } from '../constants';
import envs from '../envs';
import { dateHasPassed } from '../app/api/utils/date.util';

type Token = { token: string; expires: string }
type Tokens = { access: Token, refresh: Token }

const refreshAuthToken = async (token: string) => {
  try {
    const response = await axios.post<{ data: { tokens: Tokens } }>(
      `${envs.baseUrl}/api/refresh-auth-tokens`,
      { token }
    );

    return {
      data: response.data.data.tokens
    };
  } catch (error) {
    return {
      error: (error as any).response.message || (error as any).message
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            `${envs.baseUrl}/api/login`,
            {
              email: credentials!.email,
              password: credentials!.password,
            }
          );

          return {
            token: response.data.data.tokens.access.token,
            data: response.data.data,
          } as unknown as Awaitable<User | null>;
        } catch (error) {
          throw new Error(JSON.stringify((error as any).response.data));
        }
      },
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as any;

      ;(session as any).token = token.accessToken as any;
      ;(session as any).expires = token.accessTokenExpires as any;
      ;(session as any).error = token.error
      return session;
    },
    async jwt({ token, user }: { token: JWT; user: any }) {
      // initial signin
      if (user) {
        token.accessToken = user.token;
        token.accessTokenExpires = user.data.tokens.access.expires;
        token.refreshToken = user.data.tokens.refresh.token;
        token.refreshTokenExpires = user.data.tokens.refresh.expires;
        token.user = user.data.user;

        return token
      }

      // refresh token has expired
      if (dateHasPassed(new Date(token.refreshTokenExpires as string))) {
        return {
          ...token,
          error: "RefreshAccessTokenError",
        }
      }

      // access token has expired
      if (dateHasPassed(new Date(token.accessTokenExpires as string))) {
        const updatedToken = await refreshAuthToken(token.refreshToken as string)
        if (updatedToken.error || !updatedToken.data) {
          return {
            ...token,
            error: "RefreshAccessTokenError",
          }
        }

        token.accessToken = updatedToken.data.access.token;
        token.accessTokenExpires = updatedToken.data.access.expires;
        token.refreshToken = updatedToken.data.refresh.token;
        token.refreshTokenExpires = updatedToken.data.refresh.expires;
      }

      return token;
    },
    async redirect({ url }) {
      return Promise.resolve(url);
    },
    async signIn() {
      return true; // Do different verification for other providers that don't have `email_verified`
    }
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
