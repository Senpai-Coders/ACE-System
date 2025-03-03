import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

import { generateUserProfileS3URL } from "@/lib/aws-s3";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { generateOTP, newDate, validateId } from "@/lib/server-utils";

import { eventIdSchema } from "@/validation-schema/commons";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { createMemberWithUploadSchema } from "@/validation-schema/member";
import { TMember } from "@/types";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = eventIdSchema.parse(params.id);
        
        const eventAttendees = await db.eventAttendees.findMany({
            where: { eventId },
            include: {
                event: {
                    select: {
                        election: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
            orderBy: [{ createdAt: "desc" }, { updatedAt: "desc" }],
        });
        return NextResponse.json(eventAttendees);
    } catch (e) {
        routeErrorHandler(e, req);
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.json();
        const user = await currentUserOrThrowAuthError();

        const memberData = {
            ...data,
            createdBy: user.id,
            voteOtp: generateOTP(6),
            picture:
                data.picture && data.picture.startsWith("https://")
                    ? data.picture
                    : generateUserProfileS3URL(
                          data.passbookNumber.toUpperCase()
                      ),
        };

        createMemberWithUploadSchema.parse(memberData);

        const newMember = await db.eventAttendees.create({ data: memberData });

        return NextResponse.json(newMember);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};

const chunkMemberData = (array: {passbookNumber:string, eventId:string}[], size: number) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
        chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
};

export const PATCH = async (
    req: NextRequest,
    { params }: { params: { id: number } }
) => {
    try {
        const startTime = performance.now(); // Start timing

        const id = Number(params.id);
        validateId(id);
        const user = await currentUserOrThrowAuthError();
        const membersData = await req.json();

        if (!Array.isArray(membersData)) {
            throw new Error("Invalid data format, expected an array.");
        }

        const BATCH_SIZE = 500; // Adjust batch size as needed
        const batches = chunkMemberData(membersData, BATCH_SIZE);

        console.log(`Processing ${membersData.length} members in ${batches.length} batches`);

        const batchPromises = batches.map((batch) =>
            db.$transaction(
                batch.map((member) =>
                    db.eventAttendees.update({
                        where: {
                            eventId_passbookNumber: {
                                eventId: id,
                                passbookNumber: member.passbookNumber.toUpperCase(),
                            },
                        },
                        data: {
                            picture: generateUserProfileS3URL(member.passbookNumber.toUpperCase()),
                        },
                    })
                )
            )
        );

        const results = await Promise.allSettled(batchPromises);

        const successfulUpdates = results
            .filter((res) => res.status === "fulfilled")
            .map((res) => (res as PromiseFulfilledResult<any>).value)
            .flat();

        const endTime = performance.now(); // End timing
        console.log(`Execution Time: ${(endTime - startTime) / 1000} seconds`);

        return NextResponse.json({ updatedMembers: successfulUpdates.slice(0, 5) });
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
