import prisma from "@/prisma/client";
import {NextResponse} from "next/server";

export const POST = async (request) => {
   const getLogoId = async (divisionId) => {
      const record = await prisma.division.findUnique({
         where: {
            id: divisionId
         },
      });
      if (record.attachment_id) {
         return record.attachment_id;
      }
      if (record.parent_id) {
         return await getLogoId(record.parent_id);
      }
      return null;
   }

   const getLogo = async (divisionId) => {
      const logoId = await getLogoId(divisionId);
      if (!logoId) {
         return null;
      }
      const attach = await prisma.attachment.findFirst({
         where: {id: logoId}
      });
      return attach.body.toString();
   }

   try {
      const model = await request.json();
      const events = await prisma.event.findMany({
            where: {
               hall_id: model.hall_id,
               year: model.year,
               month: model.month,
               day: model.day
            },
            include: {
               owner: {
                  select: {
                     division_id: true
                  }
               }
            }
      });

      const unique = [...new Set(events.map(item => item.owner.division_id))];

      const dict = {};
      for (const item of unique) {
         dict[item] = await getLogo(item);
      }

      for (const event of events) {
         event.logo = dict[event.owner.division_id];
      }

      return await NextResponse.json({status: 'success', data: events});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}