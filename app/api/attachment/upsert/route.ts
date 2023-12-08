import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";

export const POST = async (request: NextRequest) => {
   const data = await request.formData()
   const file: File | null = data.get('file') as unknown as File
   const bytes = await file.arrayBuffer()
   let result = await prisma.attachment.findFirst({
      where: {
         type: file.type,
         filename: file.name,
         size: file.size,
         date: new Date(file.lastModified),
      }
   })
   if (!result) {
      //@ts-ignore
      let buf = await file.arrayBuffer().then((data) => data);
      let buffer = Buffer.from(buf);
      result = await prisma.attachment.create({
         data: {
            filename: file.name,
            type: file.type,
            size: file.size,
            date: new Date(file.lastModified),
            body: buffer
         }
      });
   }
   // if (!file.id) {
   //    result = await prisma.attachment.create({
   //       data: {
   //          filename: file.filename,
   //          type: file.type,
   //          size: file.size,
   //          date: new Date(file.date),
   //          body: Convert.FromBase64String(file.body)
   //       }
   //    })
   // } else {
   //    result = await prisma.attachment.update({
   //       where: {
   //          id: file.id
   //       },
   //       data: {
   //          filename: file.filename,
   //          type: file.type,
   //          size: file.size,
   //          date: new Date(file.date),
   //          body: file.body
   //       }
   //    })
   // }
   try {
      return await NextResponse.json({status: 'success', data: result});
   } catch (error) {
      return await NextResponse.json({status: 'error', data: error });
   }
}