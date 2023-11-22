import {NextResponse} from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import mailService from "@/services/mail.service";

const prisma = new PrismaClient();

const generatePassword = () => {
   let length = 8,
   charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*",
   retVal = "";
   for (let i = 0, n = charset.length; i < length; ++i) {
     retVal += charset.charAt(Math.floor(Math.random() * n));
   }
   return retVal;
}

export const POST = async (request) => {
   const user = await request.json();
   const _exists = await prisma.users.findFirst({
      where: {
         email: {
            equals: user.email.trim(),
            mode: 'insensitive'
         }
      }
   })

   if (_exists) {
      throw new Error(`Пользователь с почтовым адресом ${user.email} уже существует!`);
   }

   const password = generatePassword();
   const hashedPassword = await bcrypt.hashSync(password, 8);

   const selectedRoles = user.roles.filter((i) => i.active);
   const roles = {};
   for (const role of selectedRoles) {
      roles[role.role] = role.name;
   }
   try {
      await mailService.newUser(user.email, password);

      const result = await prisma.users.create({
         data: {
            name: user.name,
            email: user.email.trim(),
            contacts: user.contacts,
            begin_date: new Date(user.begin_date),
            end_date: user.end_date !== null ? new Date(user.end_date) : null,
            roles: roles,
            division_id: user.division_id,
            password: hashedPassword
         }
      });

      let json_response = {
         status: 'success',
         result: result
      }

      return NextResponse.json(json_response);
   } catch (error) {
      let error_response = {
         status: "error",
         message: error.message,
      };
      return NextResponse.json(error_response);
   }
}