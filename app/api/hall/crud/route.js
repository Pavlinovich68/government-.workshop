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

   const { model } = await request.json();
   try {
      let result = null;
      switch (model.operation) {
         case CRUD.read:
            result = read(model.model);
            break;
         case CRUD.create:
            result = create(model.model);
            break;
         case CRUD.update:
            result = update(model.model);
            break;
         case CRUD.delete:
            result = drop(model.model);
            break;
      }
      return await NextResponse.json({status: 'success', data: result});
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