// /types/next-auth.d.ts (or wherever you have it)

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /**
   * Extends the built-in JWT type.
   */
  interface JWT extends DefaultJWT {
    id: string;
    username: string | null; // <-- THE FIX: Add username here, make it nullable
  }
}

declare module "next-auth" {
  /**
   * Extends the built-in User type.
   */
  interface User extends DefaultUser {
    // Note: The User object is what's returned from the `authorize` callback.
    // It doesn't need every property from the session.
    username: string | null; // <-- THE FIX: Match Prisma schema
  }

  /**
   * Extends the built-in Session type.
   */
  interface Session {
    user: {
      id: string;
      username: string | null; // <-- THE FIX: Match Prisma schema
    } & DefaultSession["user"]; // Keep the default properties like name, email, image
  }
}
