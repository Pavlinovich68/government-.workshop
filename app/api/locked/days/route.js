import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";

export const POST = async (request) => {
   try {
      const model = await request.json();
      const query = `select
               qq.day,
               (select case when count(*) > 0 then true else false end from locked where hall_id = ${model.hall_id} and make_date(${model.year}::int, ${model.month}::int, qq.day) between begin_date + '5 HOUR'::INTERVAL and end_date + '5 HOUR'::INTERVAL) as is_locked
            from
               (select
                  generate_series(1, q.max_day::int2) as day
               from
                  (SELECT
                     DATE_PART('days',
                        DATE_TRUNC('month', make_date(${model.year}::int, ${model.month}::int, 1))
                           + '1 MONTH'::INTERVAL
                           - '1 DAY'::INTERVAL
                        ) as max_day) q) qq`;
      const result = await prisma.$queryRawUnsafe(query);
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}