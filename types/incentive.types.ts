import { Incentives } from "@prisma/client";
import { TUserMinimalInfo } from "./user.types";

export type TIncentive = Incentives;

export type TIncentiveWithClaimAndAssignedCount = TIncentive & {
    _count: { claimed: number; assigned: number };
};

// used in incentive incentive assignee table
export type TListOfAssigneesWithAssistCount = {
    eventId: number;
    id: number;
    _count: {
        claimsAssisted: number;
    };
    incentive: {
        eventId: number;
        itemName: string;
    };
    user: TUserMinimalInfo;
    incentiveId: number;
    assignedQuantity: number;
};
