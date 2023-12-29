import prismaHelper from "@/services/prisma.helpers";
import prisma from "@/prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts"

export const POST = async (request) => {
   const create = async (model) => {
      const result = await prisma.event.create({
         data: {
            name: model.name,
            year: model.year,
            month: model.month,
            day: model.day,
            start: model.value[0],
            period: model.value[1],
            hall_id: model.hall_id,
            owner_id: model.owner_id
         }
      });

      result.value= [result.start, result.period];
      return result;
   }

   const update = async (model) => {
      const result = await prisma.event.update({
         where: {
            id: model.id
         },
         data: {
            name: model.name,
            year: model.year,
            month: model.month,
            day: model.day,
            start: model.value[0],
            period: model.value[1],
            hall_id: model.hall_id,
            owner_id: model.owner_id
         }
      });

      return result;
   }

   const drop = async (model) => {
      const result = await prisma.event.delete({
         where: {
            id: model.id
         }
      })

      return result;
   }

   const { operation, model } = await request.json();
   try {
      let result = null;
      switch (operation) {
         case CRUD.read:
            break;
         case CRUD.create:
            result = await create(model);
            break;
         case CRUD.update:
            result = await update(model);
            break;
         case CRUD.delete:
            result = await drop(model);
            break;
      }
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}