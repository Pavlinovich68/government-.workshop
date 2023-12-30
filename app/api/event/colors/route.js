import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";

export const POST = async (request) => {
   const defaultColor = '#82A8CDFF';
   const emptyColor = '#969A9FFF';
   const colorsDictionary = async () => {
      const arr = await prisma.division.findMany({
         where: {
            color: {
               not: defaultColor
            }
         },
         select: {
            id: true,
            color: true
         },
         distinct: ['color']
      });

      const dict = arr.reduce((acc, cur) => {
         acc[cur.id] = cur.color;
         return acc;
      }, {});

      return dict;
   }
   const dayData = (data, colors) => {
      let fullArray = [];
      const arr = data.map((item) => {
         return {
            start: item.start / 5,
            length: item.period / 5,
            color: colors[item.owner.division_id]??defaultColor,
         };
      });
      arr.forEach((item) => {
         const _arr = Array.from(Array(item.length).keys()).map((i) => {
            return { index: i + item.start, color: item.color };
         });
         fullArray = fullArray.concat(_arr);
      });

      const result = [];
      Array.from(Array(288).keys()).map((i) =>
         fullArray.map((y) => y.index).includes(i)
            ? (result[i] = `${fullArray.find((z) => z.index === i).color}`)
            : (result[i] = emptyColor)
      );

      return result;
   };

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
      const colors = await colorsDictionary();
      const result = dayData(events, colors);
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}