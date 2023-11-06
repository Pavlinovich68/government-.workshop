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
            username: { label: "Username", type: "text", placeholder: "hfkjsd" },
            password: { label: "Password", type: "password" }
         },
         async authorize(credentials) {

         }
      })
   ],
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