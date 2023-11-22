import {NextResponse} from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request) => {
   const user = await request.json();
   try {
      const result = await prisma.users.update({
         where: {id: user.id},
         data: {
            end_date: new Date()
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
         message: error,
      };
      return NextResponse(JSON.stringify(error_response), {
         status: 500,
         headers: { "Content-Type": "application/json" },
      });
   }
}