import prisma from "../../../../prisma/client";
import {NextResponse} from "next/server";

export const GET = async (request, {params}) => {
   const {filter} = params;

   try {
      const result = await prisma.division.findMany({
            where: {email: email}
      });

      let json_response = {
            status: "success",
            result,
      };
      return NextResponse.json(json_response);
   } catch (error) {
      let error_response = {
            status: "error",
            message: error.stack,
      };
      return new NextResponse(JSON.stringify(error_response), {
            status: 500,
            headers: { "Content-Type": "application/json" },
      });
   }
}