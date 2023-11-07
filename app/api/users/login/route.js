import prisma from "../../../../prisma/client";
import bcrypt from "bcryptjs";
import ApiError from "../../api-error";
import {NextResponse} from "next/server";

export const POST = async (request) => {
   const {login, password} = await request.json();

   try {
      const user = await prisma.users.findFirst({
            where: {
               email: login
            }
      });

      if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден');
      }

      const isPassEquals = await bcrypt.compare(password, user.password);
      if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль')
      }

      let json_response = {
            status: "success",
            user,
      };

      return NextResponse.json(json_response);
   } catch (error) {
      console.log(error);
      let error_response = {
            status: "error",
            message: error.stack,
      };
      return new NextResponse(JSON.stringify(error_response), {
            status: 500,
            headers: { "Content-Type": "application/json" },
      });
   }
}