import React from "react";

import InvalidPrompt from "@/components/invalid-prompt";
import IncentiveAssigneeTable from "./_components/incentive-assignee-table";

import { isAllowed } from "@/lib/utils";
import { currentUserOrFalse } from "@/lib/auth";
import { eventIdSchema } from "@/validation-schema/commons";

type Props = { params: { id: number } };

const AssignPage = async ({ params }: Props) => {
    const user = await currentUserOrFalse();

    if (!isAllowed(["root", "admin", "staff"], user))
        return (
            <div className="flex px-4 min-h-screen flex-col w-full">
                <InvalidPrompt message="You don't have rights to view this page" />
            </div>
        );

    const eventId = eventIdSchema.parse(params.id);

    return (
        <div className="flex px-4 min-h-screen flex-col w-full">
            <IncentiveAssigneeTable eventId={eventId} />
        </div>
    );
};

export default AssignPage;
