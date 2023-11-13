import NextAuth from 'next-auth/next';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
   adapter: PrismaAdapter(prisma),
   providers: [
      CredentialsProvider({
         name: "credentials",
         credentials: {
            username: { label: "Username", type: "text", placeholder: "Имя пользователя"},
            password: { label: "Password", type: "password" },
            email: {label: "Email", type: "email" },
            roles: {label: "Roles", type: "json"}
         },
         async authorize(credentials) {
            if(!credentials.email || !credentials.password) {
               return null;
            }

            const user = await prisma.users.findUnique({
               where: {
                  email: credentials.email
               },
               include: { division: true }
            });

            if (!user) {
               return null;
            }

            const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

            if (!passwordsMatch) {
               return null;
            }

            return user;
         }
      })
   ],
   session: {
      strategy: "jwt"
   },
   callbacks: {
      async jwt({token, user, session, account}){
         if (user) {
            token.division_id = user.division_id;
            token.division_name = user.division?.name
            token.roles = user.roles;
         }
         return token;
      },
      async session({session, user, token}){
         if (token) {
            session.user.division_id = token.division_id;
            session.user.division_name = token.division_name;
            session.user.roles = token.roles;
         }
         return session;
      }
   },
   secret: process.env.NEXTAUTH_SECRET,
   debug: process.env.NODE_ENV === "development"
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }