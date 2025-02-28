import { isSameDay } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/database";
import { TMemberAttendeesMinimalInfo } from "@/types";
import { eventIdSchema } from "@/validation-schema/commons";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { attendeeRegisterSchema } from "@/validation-schema/event-registration-voting";

type TParams = { params: { id: number } };

export const POST = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = eventIdSchema.parse(params.id);
        const data = await req.json();

        const { passbookNumber, birthday } = attendeeRegisterSchema.parse(data);

        const memberAttendee = await db.eventAttendees.findUnique({
            where: {
                eventId_passbookNumber: {
                    eventId,
                    passbookNumber,
                },
            },
            include: {
                event: true,
            },
        });

        if (!memberAttendee)
            return NextResponse.json(
                { message: "Not found, for verification" },
                { status: 404 }
            );

        // DUE TO CHANGES / REQUEST of client,
        //
        // 1st feature before was that birthday should be used
        // as 2nd verification for registration and voting.
        //
        // suddenly birthday should be optional said by client so even though the birthday is
        // STRICTLY required for registration as verification it was implemented instead,

        // Regardless, it was implemented instead, so I wrap it to skip all member who dont have date
        // of birth so anyone can type any date on registration and the system will let them pass through
        if (
            memberAttendee.birthday &&
            memberAttendee.event.requireBirthdayVerification
        ) {
            if (!birthday || !isSameDay(birthday, memberAttendee.birthday))
                return NextResponse.json(
                    { message: "Wrong birthday, please try again" },
                    { status: 403 }
                );
        }

        const registered: TMemberAttendeesMinimalInfo =
            await db.eventAttendees.update({
                select: {
                    id: true,
                    firstName: true,
                    passbookNumber: true,
                    middleName: true,
                    lastName: true,
                    contact: true,
                    picture: true,
                    birthday : true,
                    registered: true,
                    voted: true,
                },
                where: {
                    eventId_passbookNumber: {
                        eventId,
                        passbookNumber,
                    },
                },
                data: {
                    registered: true,
                },
            });

        const response = NextResponse.json(registered);

        response.cookies.set("recent-user", registered.passbookNumber, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
        });

        return response;
    } catch (e) {
        console.error(e);
        return routeErrorHandler(e, req);
    }
};
