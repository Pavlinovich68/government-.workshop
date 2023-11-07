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
               }
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
   callbacks: {
      async jwt({token, user, session}){
         console.log('JWT Callback', {token, user, session});
         return token;
      },
      async session({session, token, user}){
         console.log('Session Callback', {session, token, user});
         return session;
      }
   },
   session: {
      strategy: "jwt"
   },
   secret: process.env.NEXTAUTH_SECRET,
   debug: process.env.NODE_ENV === "development"
}

const handler = NextAuth(authOptions);

// const handler = NextAuth({
//    providers: [
//       CredentialsProvider({
//             id: "credentials",
//             name: "Credentials",
//             async authorize(credentials){
//                try {
//                   const isPassEquals = await bcrypt.compare(credentials.password, credentials.hash);
//                   if (!isPassEquals) {
//                      throw ApiError.BadRequest('Неверный пароль')
//                   }

//                   return {email: credentials.email, name: credentials.name, password: credentials.hash };
//                }  catch (error) {
//                   throw new Error(error);
//                }
//             }
//       })
//    ]
// });

export { handler as GET, handler as POST }