import {NextResponse} from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const readNode = async (id) => {
   const data = await prisma.division.findMany({
      where : {parent_id: id},
      orderBy: {
         name: 'asc'
      }
   });

   const result = data.map((item) => {
      return {
         key: `${id??0}-${item.id}`,
         data: {
            id: item.id,
            name: item.name,
            short_name: item.short_name,
            contacts: item.contacts
         }
      }
   });

   for (const node of result) {
      node.children = await readNode(node.data.id);
   }

   console.log('Read divisions in route.js', result)

   return result;
}

export const GET = async (req) => {
   try {
      const result = await readNode(null);
      let json_response = {
            status: "success",
            result: result,
      };
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