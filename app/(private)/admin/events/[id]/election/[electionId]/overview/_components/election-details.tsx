"use client";
import { Card, CardContent } from "@/components/ui/card";
import { newDate } from "@/lib/utils";
import { TElection } from "@/types";
import moment from "moment";
import React from "react";

type Props = {
   election: TElection;
   eventDate:Date
};

const ElectionDetails = ({ election,eventDate }: Props) => {
   
   return (
      <Card className="bg-muted border-0">
        <CardContent className="flex flex-col lg:flex-row text-[min(17px,3.5vw)] lg:space-x-5 w-full bg-background/50 dark:text-muted-foreground rounded-2xl p-5">
        <p>id: {election.id}</p>
         <h1 className="">title: <span className="text-primary font-bold">{election.electionName}</span></h1>
         <h1>date: {moment(newDate(eventDate)).format("LL")}</h1>
        </CardContent>
      </Card>
   );
};

export default ElectionDetails;
