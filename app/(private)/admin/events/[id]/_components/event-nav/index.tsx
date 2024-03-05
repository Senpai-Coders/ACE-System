import {  TEventWithElection, TNavListRoute } from "@/types";
import {
    BaggageClaim,
    Gift,
    ListChecks,
    Users,
    Vote,
} from "lucide-react";
import React from "react";
import EventNavItems from "./event-nav-items";

export const EventRoutes: TNavListRoute[] = [
    {
        icon: <Users className="size-5" />,
        name: "Members",
        path: "manage-member",
    },
    {
        icon: <ListChecks className=" size-5" />,
        name: "Attendance",
        path: "attendance",
    },
    {
        icon: <Gift className="size-5" />,
        name: "Incentive",
        path: "incentive",
    }
];

type Props = {
    hasElection: boolean;
};

const EventNav = ({ event }: { event: TEventWithElection }) => {
    const finalRoutes: TNavListRoute[] = [
        ...EventRoutes,
        ...(event.election
            ? [
                  {
                      icon: <Vote className="size-5" />,
                      name: "Election",
                      path: `election/${event.election.id}`,
                  },
              ]
            : []),
    ];

    return (
        <div className="flex space-x-1 w-full justify-evenly lg:justify-start ">
            {finalRoutes.map((route: TNavListRoute, i) => {
                return <EventNavItems eventId={event.id} route={route} key={i} />;
            })}
        </div>
    );
};

export default EventNav;