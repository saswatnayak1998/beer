import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    hashedPassword?: string | null;
  }
}

export {}; 