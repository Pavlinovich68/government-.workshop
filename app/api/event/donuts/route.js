import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";

export const POST = async (request) => {
   const addDays = (date, days) => {
      let result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
   }

   const addMonths = (date, months) => {
      let result = new Date(date);
      result.setMonth(result.getMonth() + months);
      return result;
   }

   const lastDay = (year, month) => {
      let date = addDays(addMonths(new Date(year, month, 1), 1), -1);
      return date.getDate();
   };

   const dayData = async (data) => {
      let fullArray = [];
      const arr = data.map((item) => {
         return {
            start: item.start / 5,
            length: item.period / 5,
            color: item.owner.division.color,
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
            : (result[i] = '#969A9F')
      );

      return result;
   };

   const calcDonut = async (arr) => {
      const unique = [...new Set(arr)];
      const data = unique.map((i) => {
         return { color: i, count: arr.filter((j) => j === i).length };
      });

      const colors = data.map((i) => i.color);
      const counts = data.map((i) => i.count);
      return { datasets: [{ data: counts, backgroundColor: colors }] };
   };

   try {
      const model = await request.json();
      const events = await prisma.event.findMany({
         where: {
            hall_id: model.hall_id,
            year: model.year,
            month: model.month-1
         },
         include: {
            owner: {
               include: {
                  division: {
                     select: {
                        color: true,
                     }
                  }
               }
            }
         }
      });

      const cnt = lastDay(model.year, model.month);
      const days = Array.from(Array(cnt).keys()).map((i) => i + 1);

      const result = [];
      for (let item in days) {
         const filteredData = events.filter((i) => i.day === days[item]);
         const resultItem = await dayData(filteredData);
         const data = await calcDonut(resultItem);
         result[item] = { day: days[item], data: data };
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}