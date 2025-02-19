"use client";
import { TNavListRoute } from "@/types";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  route: TNavListRoute;
  params: { id: number; electionId: number };
};

const ElectionSideBarItems = ({ route, params }: Props) => {
  const { icon, path, name } = route;
  const pathname = usePathname();
  const isCurrentPath = pathname.includes(path);

  return (
    <Link
      href={`/admin/events/${params.id}/election/${params.electionId}/${path}`}
      className="flex lg:px-2 cursor-pointer justify-start px-2 "
    >
      <div
        className={`flex space-x-0 justify-center lg:justify-start items-center lg:space-x-2 
                         ${
                           isCurrentPath
                             ? " bg-gradient-to-b to-[#1e1d1e00] from-primary/70 text-green-900 shadow-lg hover:text-gray-900 dark:bg-gradient-to-b dark:to-[#1E1D1E] py-3  dark:from-primary/60  dark:text-white font-bold"
                             : " text-muted-foreground  hover:bg-gradient-to-l hover:from-primary/70 hover:text-bold hover:to-[#1e1d1e00] hover:to-90% hover:hover:text-gray-900 text-gray-800 "
                         }
                      lg:px-5 w-16 py-0 lg:py-2 lg:w-fit ease-in-out duration-300 hover:text-primary dark:hover:bg-gradient-to-b
                       dark:hover:to-[#1E1D1E] dark:hover:from-primary/60 dark:hover:text-primary  shadow-sm  rounded-xl`}
      >
        <div
          className={`${isCurrentPath ? "dark:text-primary text-green-900" : " "} dark:hover:text-primary`}
        >
          {icon}
        </div>
        <h1
          className={`hidden lg:block text-[min(14px,1.9vw)]  ${isCurrentPath ? "dark:text-white" : "dark:text-[#d3d3d3]"} `}
        >
          {name}
        </h1>
      </div>
    </Link>
  );
};

export default ElectionSideBarItems;
