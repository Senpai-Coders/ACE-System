import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { ExcelDateToJSDate, generateOTP, validateId } from "@/lib/server-utils";
import { createManySchema } from "@/validation-schema/member";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";
type TParams = { params: { id: number } };


export const POST = async (req: NextRequest, { params }: TParams) => {
   try {
      const id = Number(params.id);
      validateId(id);
      const user = await currentUserOrThrowAuthError();
      const membersData = await req.json();

      const modifiedMembersData = membersData.map(
         (member:any) => {
            const date = new Date()
            return {
               ...member,
               passbookNumber:member.passbookNumber === "" || null || undefined ? "" :member.passbookNumber,
               createdBy: user.id,
               birthday: ExcelDateToJSDate(member.birthday) === null || "" || undefined ? date : ExcelDateToJSDate(member.birthday),
               eventId: id,
               middleName:member.middleName  === "" || null || undefined ? "" : member.middleName,
               emailAddress: member.emailAddress  === "" || null || undefined ? "" : member.emailAddress,
               contact: member.contact === "" || null || undefined ? "" : member.contact.toString(),
               voteOtp: generateOTP(6),
            };
         }
      );
      modifiedMembersData.forEach((member:any) => {
         createManySchema.parse(member);
      });
      const newMember = await db.eventAttendees.createMany({
         data: modifiedMembersData,
         skipDuplicates: true,
      });
      return NextResponse.json(newMember);
   } catch (e) {
      return routeErrorHandler(e, req);
   }
};
