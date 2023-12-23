import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";

export const POST = async (request) => {
   try {
      const model = await request.json();
      const query = `select e.day, count(*)::int as cnt from event e where e.hall_id = ${model.hall_id??-1} and e.year = ${model.year} and e.month = ${model.month} group by e.day`;
      const result = await prisma.$queryRawUnsafe(query);
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}