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

   const timeInterval = (start, finish) => {
      let startHours = Math.floor(start / 60);
      let startMinutes = start - startHours * 60;
      let finishHours = Math.floor(finish / 60);
      let finishMinutes = finish - finishHours * 60;
      let result = `${startHours.toString().padStart(2, '0')}:${startMinutes.toString().padStart(2, '0')} - ${finishHours.toString().padStart(2, '0')}:${finishMinutes.toString().padStart(2, '0')}`;
      return result;
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
                  include: {
                     division: {
                        select: {
                           short_name: true
                        }
                     }
                  }
               }
            },
            orderBy: [
               {start: 'asc'},
            ]
      });

      const unique = [...new Set(events.map(item => item.owner.division_id))];

      const dict = {};
      for (const item of unique) {
         dict[item] = await getLogo(item);
      }

      for (const event of events) {
         event.logo = dict[event.owner.division_id];
      }

      const result = events.map((item) => {
         return {
            id: item.id,
            comment: item.name,
            timeInterval: timeInterval(item.start, item.period),
            division: item.owner.division.short_name,
            owner: item.owner.name,
            email: item.owner.email,
            phone: item.owner.phone,
            logo: item.logo
         }
      } );

      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}