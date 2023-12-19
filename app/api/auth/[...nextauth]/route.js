import NextAuth from 'next-auth/next';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { use } from 'react';

const prisma = new PrismaClient();

export const authOptions = {
   adapter: PrismaAdapter(prisma),
   debug: true,
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
               include: { 
                  division: true
               }
            });

            if (!user) {
               return null;
            }

            const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

            if (!passwordsMatch) {
               return null;
            }

            const division = await prisma.division.findUnique({
               where: {
                  id: user.division.id
               },
               include: { 
                  halls: true
               }
            });

            user.avatar = user.avatar?.body;
            user.halls = division.halls;

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
            token.halls = user.halls;
            token.avatar = user.attachment_id;
         }
         return token;
      },
      async session({session, user, token}){
         if (token) {
            session.user.division_id = token.division_id;
            session.user.division_name = token.division_name;
            session.user.roles = token.roles;
            session.user.halls = token.halls;
            session.user.avatar = token.avatar;
         }
         return session;
      }
   },
   secret: process.env.NEXTAUTH_SECRET,
   debug: process.env.NODE_ENV === "development"
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }