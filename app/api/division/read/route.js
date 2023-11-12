import prisma from "../../../../prisma/client";
import {NextResponse} from "next/server";

export const GET = async (req) => {
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
            id: item.id,
            name: item.name,
            short_name: item.short_name,
            contacts: item.contacts
         }
      });

      for (const node of result) {
         node.childrens = await readNode(node.id);
      }
      return result;
   }

   try {
      //const params = req.nextUrl.searchParams.get('search');
      const result = await readNode(null);
      let json_response = {
            status: "success",
            result,
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