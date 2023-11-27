import prismaHelper from "@/services/prisma.helpers";
import prisma from "../../../../prisma/client";
import {NextResponse} from "next/server";

export const POST = async (request) => {
   const {pageSize, pageNo, orderBy, searchStr, showClosed} = await request.json();

   try {
      let filter = {};
      if (searchStr) {
         filter['OR'] = prismaHelper.OR(['name', 'short_name', 'division.name'], searchStr);
      }

      const totalCount = await prisma.hall.count({where: filter});
      const result = await prisma.hall.findMany({
         skip: pageSize * (pageNo -1),
         take: pageSize,
         where: filter,
         orderBy: orderBy,
         include: {division: true}
      });

      let json_response = {
         status: "success",
         data: {
            recordCount: totalCount,
            pageCount: Math.ceil(totalCount / pageSize),
            pageNo: pageNo,
            pageSize: pageSize,
            result: result
         },
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