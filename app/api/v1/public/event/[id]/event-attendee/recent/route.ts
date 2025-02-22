import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import { TMemberAttendeesMinimalInfo } from "@/types";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const { id: eventId } = eventIdParamSchema.parse(params);
        const recentPb = req.cookies.get("recent-user")?.value;

        if (!recentPb)
            return NextResponse.json(
                { message: "No recent user" },
                { status: 400 }
            );

        const member: TMemberAttendeesMinimalInfo | null =
            await db.eventAttendees.findUnique({
                where: {
                    eventId_passbookNumber: {
                        passbookNumber: recentPb,
                        eventId,
                    },
                },
                select: {
                    id: true,
                    firstName: true,
                    middleName: true,
                    lastName: true,
                    contact: true,
                    picture: true,
                    passbookNumber: true,
                    registered: true,
                    voted: true,
                },
            });

        if (!member)
            return NextResponse.json(
                { message: "No recent user" },
                { status: 404 }
            );

        return NextResponse.json(member);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
