import prismaHelper from "@/services/prisma.helpers";
import prisma from "../../../../prisma/client";
import {NextResponse} from "next/server";
import {appRoles} from "@/prisma/roles/index";

export const POST = async (request) => {
   const {pageSize, pageNo, orderBy, searchStr, showClosed} = await request.json();

   try {
      let filter = {};
      if (searchStr) {
         filter['OR'] = prismaHelper.OR(['name', 'email', 'division.name'], searchStr);
         if (!showClosed) {
            filter['AND'] = [{ OR: [{ end_date: null }, { end_date: { gt: new Date() } }]}];
         }
      } else {
         if (!showClosed) {
            filter['OR'] = [{end_date: null}, {end_date: { gt: new Date() }}];
         }
      }

      const totalCount = await prisma.users.count({where: filter});
      const result = await prisma.users.findMany({
         skip: pageSize * (pageNo -1),
         take: pageSize,
         where: filter,
         orderBy: orderBy,
         include: {division: true}
      });

      for (const user of result) {
         user.roles = Object.entries(appRoles).map((role) => {
            return {
               role: role[0],
               name: role[1],
               active: user.roles[role[0]] !== undefined
            }
         });
      }

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