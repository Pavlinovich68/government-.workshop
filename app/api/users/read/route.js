import prisma from "../../../../prisma/client";
import {NextResponse} from "next/server";

export const POST = async (request) => {
    const {pageSize, pageNo, orderBy, searchStr} = await request.json();

    console.log('pageSize:', pageSize);
    console.log('pageNo:', pageNo);
    console.log('orderBy:', orderBy);
    console.log('searchStr:', searchStr);

    try {
        let filter = {};
        if (searchStr) {
            filter = {
                OR: [
                    {
                        name: {
                            contains: searchStr,
                            mode: 'insensitive',
                        },
                    },
                    {
                        email: {
                            contains: searchStr,
                            mode: 'insensitive',
                        },
                    },
                    {
                        division: {
                            name: {
                                contains: searchStr,
                                mode: 'insensitive',
                            }
                        },
                    },
                ]
            }
        }

        const totalCount = await prisma.users.count({where: filter});
        console.log('totalCount:', totalCount);
        const result = await prisma.users.findMany({
            skip: pageSize * (pageNo -1),
            take: pageSize,
            where: filter,
            //orderBy: orderBy,
            include: {division: true}
        });

        console.log('result:', result);

        let json_response = {
            status: "success",
            data: {
                recordCount: totalCount,
                pageCount: Math.ceil(totalCount / pageSize),
                pageNo: pageNo,
                pageSize: pageSize,
                result: result
            },
        };
        console.log('json_response:', json_response);
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