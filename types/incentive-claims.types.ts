import { IncentiveClaims } from "@prisma/client";
import { TUserMinimalInfo } from "./user.types";
import { TMemberAttendeeMinimalInfo } from "./member-attendees.types";
import { TIncentive, TIncentiveMinimalInfo } from "./incentive.types";
import { TIncentiveAssignedWithUserMinimalInfo } from "./incentive-assigned.types";

export type TIncentiveClaims = IncentiveClaims;

export type TIncentiveClaimsWithIncentiveAndClaimAssistance = TIncentiveClaims & {
    assigned : TIncentiveAssignedWithUserMinimalInfo | null,
    incentive : TIncentive 
}

export type TIncentiveClaimsMinimalInfo = {
    id: number;
    eventId: number;
    eventAttendeeId: string;
    createdAt: Date;
    eventAttendee: TMemberAttendeeMinimalInfo;
}

export type TIncentiveClaimsWithIncentiveAndAssistedBy = TIncentiveClaimsMinimalInfo & {
    eventAttendee : TMemberAttendeeMinimalInfo,
    incentive: TIncentiveMinimalInfo,
    assistedBy : TUserMinimalInfo | null
}

// for claim auth for public
export type TIncentiveClaimAuth = {
    eventId: number;
    attendeeId: string;
    passbookNumber: string;
};