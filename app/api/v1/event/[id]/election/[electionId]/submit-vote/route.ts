import db from "@/lib/database";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

import { sendMail } from "@/lib/mailer";
import { TVoteAuthorizationPayload } from "@/types";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { memberEmailSchema } from "@/validation-schema/member";
import { chosenCandidateIds } from "@/validation-schema/election";

export const POST = async (req: NextRequest) => {
    try {
        const vauth = req.cookies.get("v-auth")?.value;
        const { candidateIds: unparsedIds } = await req.json();
        const candidateIds = chosenCandidateIds.parse(unparsedIds);

        if (!vauth)
            return NextResponse.json(
                { message: "You dont have system credentials to vote" },
                { status: 403 },
            );

        const verifiedJwt = await jwtVerify<TVoteAuthorizationPayload>(
            vauth,
            new TextEncoder().encode(process.env.VOTING_AUTHORIZATION_SECRET),
        );

        const { attendeeId, electionId } = verifiedJwt.payload;

        if (!attendeeId)
            return NextResponse.json(
                {
                    message:
                        "There's a problem with your authorization, please retry voter member verification again.",
                },
                { status: 400 },
            );

        const voter = await db.eventAttendees.findUnique({
            where: { id: attendeeId },
            select: {
                voted: true,
                emailAddress: true,
            },
        });

        if (!voter)
            return NextResponse.json(
                { message: "Sorry we can't identify who you are" },
                { status: 404 },
            );

        if (voter?.voted) {
            const response = NextResponse.json(
                { message: "You already voted" },
                { status: 403 },
            );
            response.cookies.delete("v-auth");
            return response;
        }

        const election = await db.election.findUnique({
            where: { id: electionId },
            include: { event: true, positions: { include: { candidates: true } } },
        });

        if (!election)
            return NextResponse.json(
                {
                    message:
                        "Sorry but this election was not found. Please contact admin",
                },
                { status: 404 },
            );

        const [saveVote, voterUpdate] = await db.$transaction([
            db.votes.createMany({
                data: candidateIds.map((candidateId) => ({
                    attendeeId,
                    candidateId,
                    electionId,
                })),
            }),
            db.eventAttendees.update({
                where: { id: attendeeId },
                data: { voted: true },
            }),
        ]);

        if (
            voter.emailAddress &&
            memberEmailSchema.safeParse(voter.emailAddress).success
        ) {
            const { firstName, lastName } = voterUpdate;

            const electionPosition = election.positions;

            const payload = {
                iconImage: `${process.env.DEPLOYMENT_URL}/images/vote-saved.png`,
                title: election.event.title,
                coverImage: election.event.coverImage,
                participantName: `${firstName} ${lastName}`,
                eventLink: `${process.env.DEPLOYMENT_URL}/events/${election.event.id}`,
                voted: "",
            };

            electionPosition.map((position) => {
                payload.voted += `<p style=" font-family: helvetica, sans-serif;text-decoration: none;color: #333;font-weight: 800;display: block;font-size: 16px; line-height: 24px; margin: 1em 0 0em;padding: 0;">${position.positionName}</p>`;
                const voted = position.candidates.filter((candidate) =>
                    candidateIds.includes(candidate.id),
                );
                if(voted.length === 0) payload.voted += `<p style="font-family:helvetica, sans-serif; font-size:16px;">no candidate selected</p>`;
                voted.forEach((candidate) => {
                    payload.voted += `<p style="font-family:helvetica, sans-serif; font-size:16px;">${candidate.firstName} ${candidate.lastName}</p>`;
                });
            });

            await sendMail(
                "Confirmation: Your Vote has been Successfully Submitted",
                voter.emailAddress,
                "vote-submit.html",
                payload,
            );
        }

        const response = NextResponse.json("Ok");

        response.cookies.delete("v-auth");
        return response;
    } catch (e) {
        return routeErrorHandler(e, req.method);
    }
};
