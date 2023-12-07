import prisma from "@/prisma/client";
import {NextResponse} from "next/server";

export const POST = async (request) => {
   const file = await request.json();
   const blob = await fetch(file.objectURL).then(r => r.blob());
   try {
      const result = 100;
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error.stack });
   }
}