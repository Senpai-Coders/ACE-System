"use client"
import { TElectionRoute } from "@/types";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
   route: TElectionRoute;
};

const EventNavItems = ({ route}: Props) => {
   const { icon, path, name } = route;
   const pathname = usePathname();
   const isCurrentPath = pathname.includes(path);

   return (
      <Link href={`${path}`} className="flex cursor-pointer justify-start space-x-2">
         <div className={`flex space-x-2 duration-300  ease-in-out ${isCurrentPath ? "bg-white dark:bg-primary/20 text-[#099065] font-bold":"text-foreground/90 "} px-5  hover:bg-white dark:hover:bg-primary/30 shadow-sm p-2 rounded-xl`}>
            <div className="">
            </div>
            <h1 className="">{name}</h1>
         </div>
      </Link>
   );
};

export default EventNavItems;
