import prisma from "../../../../prisma/client";
import {NextResponse} from "next/server";

export const GET = async (request, {params}) => {
   const readNode = async (id, search) => {
      const {filter} = {parent_id: id};
      if (search) {
            filter = {
               OR: [
                  {
                     name: {
                        contains: search,
                        mode: 'insensitive',
                     },
                  },
                  {
                     short_name: {
                        contains: search,
                        mode: 'insensitive',
                     },
                  },
                  {
                     contacts: {
                        contains: search,
                        mode: 'insensitive',
                     },
                  },
               ],
               AND: [{parent_id: id}]
         }
      }

      const data = await prisma.division.findMany({
         where : filter,
         orderBy: {
            name: 'asc'
         }
      });

      const result = data.map((item) => {
         return {
            key: `${id}-${item.id}`,
            id: item.id,
            name: item.name,
            short_name: item.short_name,
            contacts: item.contacts
         }
      });

      for (const node of result) {
         result.childrens = await readNode(node.id, search);
      }
      return result;
   }

   try {
      const result = await readNode(null, params);

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