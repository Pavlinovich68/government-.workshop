import prisma from "@/prisma/client";
import {NextRequest, NextResponse} from "next/server";
import { createHash } from 'node:crypto'

const md5 = (content: any) => {
   return createHash('md5').update(content).digest('hex')
}

export const POST = async (request: NextRequest) => {
   const url = new URL(request.url);
   const id = url.searchParams.get("id");
   const data = await request.formData()
   const file: File | null = data.get('file') as unknown as File;
   let buf = await file.arrayBuffer().then((data) => data);
   const hash = md5(buf.toString());
   let result = await prisma.attachment.findFirst({
      where: {
         type: file.type,
         filename: file.name,
         size: file.size,
         md5: hash
      }
   });
   if (id && id !== 'null' && parseInt(id) !== result?.id){
      try {
         const droppedAttachment = await prisma.attachment.delete({
            where: {
               id: parseInt(id)
            }
         })
      } catch(error) {
         console.log(error);
      }
   }
   if (!result) {
      let buffer = Buffer.from(buf);
      result = await prisma.attachment.create({
         data: {
            filename: file.name,
            type: file.type,
            size: file.size,
            date: new Date(file.lastModified),
            body: buffer,
            md5: hash
         }
      });
   }
   try {
      return await NextResponse.json({status: 'success', data: result});
   } catch (error: any) {
      return await NextResponse.json({status: 'error', data: error.message });
   }
}

function computeChecksumMd5(file: any, File: { new(fileBits: BlobPart[], fileName: string, options?: FilePropertyBag | undefined): File; prototype: File; }) {
   throw new Error("Function not implemented.");
}
