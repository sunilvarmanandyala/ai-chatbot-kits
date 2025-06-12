// src/types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";

// Augment the built-in Session and User types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
    };
  }
  interface User extends DefaultUser {
    id: string;
  }
}
