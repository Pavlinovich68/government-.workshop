import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import {PrismaClient} from "@prisma/client";
import ApiError from "../../api-error";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            async authorize(credentials){
              try {
                  const user = await prisma.users.findFirst({
                      where: {
                          email: credentials.email
                      }
                  });

                  if (!user) {
                      throw ApiError.BadRequest('Пользователь с таким email не найден');
                  }

                  const isPassEquals = await bcrypt.compare(credentials.password, user.password);
                  if (!isPassEquals) {
                      throw ApiError.BadRequest('Неверный пароль')
                  }

                  return user;
              }  catch (error) {
                  throw new Error(error);
              }
            }
        })
    ]
});

export { handler as GET, handler as POST }