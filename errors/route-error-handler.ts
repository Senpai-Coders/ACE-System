import { ZodError } from "zod";
import { AuthenticationError } from "./auth-error";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export const routeErrorHandler = (e: unknown, req: NextRequest) => {
    if (e instanceof ZodError)
        return NextResponse.json(
            { message: e.errors[0].message },
            { status: 400 }
        );
    if (e instanceof AuthenticationError)
        return NextResponse.json({ message: e.message }, { status: 403 });

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002")
            return NextResponse.json(
                {
                    message:
                        "Conflict unique field, please make sure uniqueness of inputs",
                },
                { status: 409 }
            );
        if (e.code === "P2025")
            return NextResponse.json(
                { message: "The data you are trying to update doesn't exist" },
                { status: 400 }
            );
    }

    console.error(`ERROR : ${req.url} - [${req}]: ${e}`);
    return NextResponse.json({ message: `${e}` }, { status: 500 });
};
