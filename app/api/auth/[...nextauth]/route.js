import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaClient} from "@prisma/client";
import ApiError from "../../api-error";
import bcrypt from "bcryptjs";



const prisma = new PrismaClient();

const cookies = {
    sessionToken: {
        name: `next-auth.session-token`,
        options: {
            httpOnly: true,
            sameSite: "none",
            path: "/",
            domain: process.env.NEXT_PUBLIC_DOMAIN,
            secure: true,
        },
    },
    callbackUrl: {
        name: `next-auth.callback-url`,
        options: {
        },
    },
    csrfToken: {
        name: "next-auth.csrf-token",
        options: {
        },
    },
};

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            session: {
              strategy: "jwt",
            },
            cookies: cookies,
            async authorize(credentials){
              try {
                  const isPassEquals = await bcrypt.compare(credentials.password, credentials.hash);
                  if (!isPassEquals) {
                      throw ApiError.BadRequest('Неверный пароль')
                  }

                  return {email: credentials.email, name: credentials.name, hash: credentials.password};
              }  catch (error) {
                  throw new Error(error);
              }
            }
        })
    ]
});

export { handler as GET, handler as POST }