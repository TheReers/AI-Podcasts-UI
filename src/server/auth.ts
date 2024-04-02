import CredentialsProvider from "next-auth/providers/credentials";
import { Awaitable, User } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import axios from "axios";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers

  providers: [
    // ...add more providers here
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        console.log("credentials", credentials, process.env.REACT_APP_BASE_URL);
        return (
          axios
            .post(`${process.env.REACT_APP_BASE_URL}/`, {
              email: credentials!.email,
              password: credentials!.password,
            })
            .then((response) => {
              console.log("response", response);
              return {
                token:'token here',
                data: 'user data here',
              } as unknown as Awaitable<User | null>;
            })
            .catch((error) => {
              console.log("error", error);
              throw new Error(JSON.stringify(error.response.data));
            }) || null
        );
      },
    })
  ],
  callbacks: {
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.user = token.user as any;
      //console.log(session.user)
      (session as any).token = token.accessToken as any;
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
    

      return true; // Do different verification for other providers that don't have `email_verified`
    },
  },

  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "supersecret",
  session: {
    strategy: "jwt",
    maxAge: 5 * 60 * 60, // 5 hour
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 5, // 5 hours
  },
};
