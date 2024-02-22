import { TElectionRoute } from "@/types";
import { BaggageClaim, GanttChartSquare, Gift } from "lucide-react";
import React from "react";
import EventNavItems from "./event-nav-items";

export const EventRoutes: TElectionRoute[] = [
   {
      icon: <GanttChartSquare className="size-5" />,
      name: "Election",
      path: "election",
   },
   {
      icon: <GanttChartSquare className="size-5" />,
      name: "Manage-member",
      path: "manage-member",
   },
   {
      icon: <GanttChartSquare className=" size-5" />,
      name: "Attendance",
      path: "attendance",
   },
   {
      icon: <Gift className="size-5" />,
      name: "Incentives",
      path: "incentives",
   },
   {
      icon: <BaggageClaim className="size-5" />,
      name: "Claims",
      path: "claims",
   },
];

const EventNavBar = () => {
   return (
      <div className="flex space-x-2 -translate-x-4 ">
         {EventRoutes.map((route: TElectionRoute, i) => (
            <EventNavItems route={route} key={i} />
         ))}
      </div>
   );
};

export default EventNavBar;
