"use client"
import React, { ReactNode } from "react";
import EventNavBar, { EventRoutes } from "./_components/event-nav/event-nav";
import ElectionSideBar, { ElectionRoutes } from "./_components/election-sidebar";
import { usePathname } from "next/navigation";
import { getElection } from "@/hooks/api-hooks/election-api-hooks";

type Props = { 
    children : ReactNode
    params:{id:number}
};

const EventLayout = ( { children,params }: Props) => {

    const getUniqueElection = getElection(params.id)
    const hasElection = !getUniqueElection.data
    const pathname = usePathname();
    const pathSegments = pathname.split('/');
    const lastPath = pathSegments[pathSegments.length - 1];
    const isCurrentPath = EventRoutes.find((e)=> e.path === lastPath && e.path !== "election" )

    return (
        <div className="bg-[#eeeded] dark:bg-[#110f0e] font-poppins pt-5 lg:p-7 h-fit overflow-hidden">
            <div className="p-5 w-full">
            <EventNavBar hasElection={hasElection} />
            </div>
            <div className="flex bg-secondary  min-h-screen shadow-xl dark:bg-secondary/30 py-4 rounded-3xl overflow-x-hidden lg:p-8  w-full ">
               <div className="flex w-full px-2 flex-col lg:flex-row">
                <div>
                {!isCurrentPath && <>
                 {!hasElection && (<ElectionSideBar/>)}
              </>}
                </div>
                <div className="p-5 w-full">
                {children}
                </div>
               </div>
            </div>
        </div>
    );
};

export default EventLayout;
