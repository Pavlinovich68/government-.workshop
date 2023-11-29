import prismaHelper from "@/services/prisma.helpers";
import prisma from "../../../../prisma/client";
import {NextResponse} from "next/server";
import CRUD from "@/models/enums/crud-type.ts"

export const POST = async (request) => {
   const create = async (model) => {
      const result = await prisma.hall.create({
         data: {
            name: model.name,
            short_name: model.short_name,
            capacity: model.capacity,
         }
      });

      return result;
   }

   const read = async (model) => {
      let filter = {};
      if (model.searchStr) {
         filter['OR'] = prismaHelper.OR(['name', 'short_name'], model.searchStr);
      }

      const totalCount = await prisma.hall.count({where: filter});
      const result = await prisma.hall.findMany({
         skip: model.pageSize * (model.pageNo -1),
         take: model.pageSize,
         where: filter,
         orderBy: model.orderBy,
         include: {division: true}
      });

      let data = {
         recordCount: totalCount,
         pageCount: Math.ceil(totalCount / model.pageSize),
         pageNo: model.pageNo,
         pageSize: model.pageSize,
         result: result
      };
      return data;
   }

   const update = async (model) => {
      const result = await prisma.hall.update({
         where: {
            id: model.id
         },
         data: {
            name: model.name,
            short_name: model.short_name,
            capacity: model.capacity,
         }
      });

      return result;
   }

   const drop = async (model) => {
      const result = await prisma.hall.delete({
         where: {
            id: model.id
         }
      })
      return result;
   }

   const {operation, model} = await request.json();
   try {
      switch (operation) {
         case CRUD.read:
            return await NextResponse.json({status: 'success', data: read(model)});
         case CRUD.create:
            return await NextResponse.json({status: 'success', result: create(model)});
         case CRUD.update:
            return await NextResponse.json({status: 'success', result: update(model)});
         case CRUD.delete:
            return await NextResponse.json({status: 'success', result: drop(model)});
      }
   } catch (error) {
      let error_response = {
         status: "error",
         message: error.stack,
      };
      return NextResponse(JSON.stringify(error_response), {
         status: 500,
         headers: { "Content-Type": "application/json" },
      });
   }
}