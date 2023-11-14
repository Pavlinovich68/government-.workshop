import {NextResponse} from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request) => {
   const {name, short_name, contacts, parent_id} = await request.json();
   try {
      const result = await prisma.division.create({
         data: {
            name: name,
            short_name: short_name,
            contacts: contacts,
            parent_id: parent_id
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
         message: error.stack,
      };
      return new NextResponse(JSON.stringify(error_response), {
         status: 500,
         headers: { "Content-Type": "application/json" },
      });
   }
}