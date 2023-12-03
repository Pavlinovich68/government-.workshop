import NextAuth, {DefaultSession} from "next-auth";

declare module "next-auth" {
   interface Session {
      user: {
         password: string
      } & DefaultSession["user"]
   }
}