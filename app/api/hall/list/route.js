import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";

export const GET = async (request) => {
   try {
      const result = await prisma.hall.findMany({
         orderBy: {
            name: 'asc'
         }
      });
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}