import React from 'react'
import ElectionNavItems from './election-nav-item'
import { TElectionRoute } from '@/types'
import { LayoutDashboard, Users, Medal, Settings2, Combine } from 'lucide-react'

export const ElectionRoutes: TElectionRoute[] = [
   {
      icon: <LayoutDashboard className="h-5 w-5" />,
      name: "DashBoard",
      path: "dashboard",
   },
   {
      icon: <Combine className="h-5 w-5" />,
      name: "election",
      path: "election",
   },
  {
     icon: <Users className="h-5 w-5" />,
     name: "Candidates",
     path: "candidates",
  },
  {
     icon: <Medal className="w-5 h-5" />,
     name: "Positions",
     path: "positions",
  },
  {
     icon: <Settings2 className="w-5 h-5" />,
     name: "Settings",
     path: "settings",
  },
];
const ElectionSideBar =( ) => {
  return (
    <div className="flex flex-row lg:flex-col w-full lg:w-[220px] px-3 justify-evenly  gap-1 lg:gap-5 py-2 lg:py-10 bg-[#ffffff] h-16 lg:min-h-screen  dark:bg-secondary/50 shadow-xl  rounded-3xl lg:justify-start    ">
    {ElectionRoutes.map((route:TElectionRoute, i) => (
       <ElectionNavItems  route={route} key={i} />
    ))}
 </div>
  )
}

export default ElectionSideBar