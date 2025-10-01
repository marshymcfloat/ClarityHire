import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import prisma from "@/prisma/prisma";
import { compare } from "bcryptjs";
import { UserRoleEnum } from "@prisma/client/edge";
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENTID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialProvider({
      name: "credential",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credential) => {
        if (!credential?.username || !credential.password) {
          throw new Error("Please provide both username and password.");
        }

        const foundUser = await prisma.user.findUnique({
          where: { username: credential.username },
        });

        const genericErrorMessage = "Invalid username or password";

        if (!foundUser) {
          console.log("No user found");
          throw new Error(genericErrorMessage);
        }

        if (!foundUser.password) {
          console.log("User signed up with a provider and has no password");
          throw new Error(
            "This account was created with a provider (e.g., Google). Please sign in with that method."
          );
        }

        const correctPassword = await compare(
          credential.password,
          foundUser.password
        );

        if (!correctPassword) {
          console.log("Incorrect password");
          throw new Error(genericErrorMessage);
        }

        return {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          username: foundUser.username,
          role: foundUser.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // This callback is triggered when a user successfully signs in with ANY provider.
      // We only want to run custom logic for OAuth providers.
      if (account?.provider === "google") {
        try {
          // Check if a user with this email already exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (existingUser) {
            // If the user exists, check if they have a linked Google account
            const existingAccount = await prisma.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: "google",
                  providerAccountId: account.providerAccountId,
                },
              },
            });

            if (!existingAccount) {
              // If user exists but this specific Google account is not linked, link it.
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                },
              });
            }
          } else {
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,

                accounts: {
                  create: {
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    refresh_token: account.refresh_token,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    scope: account.scope,
                    id_token: account.id_token,
                  },
                },
              },
            });
          }

          return true; // Allow the sign-in
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false; // Prevent the sign-in if there's a DB error
        }
      }
      return true; // Allow sign-in for other providers (like credentials)
    },

    jwt: async ({ token, user }) => {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.username = dbUser.username;
          token.picture = dbUser.image;
          token.role = dbUser.role; // This is the crucial part!
        }
      }

      return token;
    },
    session: async ({ token, session }) => {
      // The session callback now receives the enriched token.
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string | null;
        session.user.image = token.picture as string | null;
        session.user.role = token.role as UserRoleEnum[]; // Pass the role to the session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
