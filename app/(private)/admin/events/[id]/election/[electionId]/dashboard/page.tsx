import { Accessibility, ClipboardMinus } from "lucide-react";
import Header from "../_components/header";
import { BarGraphSection } from "./_components/bar-graph-section";
import QuorumSection from "./_components/quorum-section";
import db from "@/lib/database"
import { z } from "zod";
import { PieGraphSection } from "./_components/pie-graph-section";
import ElectionReports from "./_reports/election-reports";
import NotFound from "../_components/not-found";
type TParams = {
   params: { id: number; electionId: number };
};

const page = async({ params }: TParams) => {
   
   const eventId = Number(params.id)
   
   z.coerce.number().parse(eventId)

   const Election = await db.election.findUnique({where:{eventId:eventId}})
   
   if(!Election) return <NotFound></NotFound>
   
   const electionName = Election.electionName

   return (
      <div className="w-full lg:w-[1000px] lg:min-w-full ">
         {Election && 
            <Header text={electionName}></Header>
         }
         <QuorumSection params={params}></QuorumSection>
         <div className="w-full flex space-x-3 justify-start px-2">
            <div className="flex space-x-2 items-center py-5">
               <div className="p-1 bg-primary rounded-lg">
                  <Accessibility className="size-5 text-slate-200" />
               </div>
               <h1 className="font-medium">Results & Graphs</h1>
            </div>
         </div>
         <div className="flex flex-col w-full items-center px-5 rounded-3xl lg:p-5 justify-center  bg-secondary/20">
            <BarGraphSection params={params}/>
            <PieGraphSection params={params} />
         </div>
         <div>
         <div className="w-full flex space-x-3 justify-start px-2">
            <div className="flex space-x-2 items-center py-5">
               <div className="p-1 bg-primary rounded-md">
                  <ClipboardMinus className="size-5 text-slate-200" />
               </div>
               <h1 className="font-medium">Reports</h1>
            </div>
         </div>
            <div className="w-full space-y-2 p-2 lg:p-5 xl:p-10 bg-background dark:bg-secondary/20 rounded-xl">
            <ElectionReports electionName={electionName} params={params} ></ElectionReports>
            </div>
         </div>
      </div>
   );
};

export default page;
