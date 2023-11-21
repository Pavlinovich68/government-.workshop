import {NextResponse} from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (request) => {
   const user = await request.json();
   const selectedRoles = user.roles.filter((i) => i.active);
   const roles = {};
   for (const role of selectedRoles) {  
      roles[role.role] = role.name;
   }
   try {
      const result = await prisma.users.update({
         where: {id: user.id},
         data: {
            name: user.name,
            email: user.email,
            contacts: user.contacts,
            begin_date: new Date(user.begin_date),
            end_date: user.end_date !== null ? new Date(user.end_date) : null,
            roles: roles,
            division_id: user.division_id
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