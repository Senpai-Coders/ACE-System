import db from "@/lib/database";
import { TCreateElection } from "@/types";
import { createEventSchema, updateEventSchema } from "@/validation-schema/event";
import { VotingEligibility } from "@prisma/client";
import { z } from "zod";

export const createEvent = async (
   event: z.infer<typeof createEventSchema>,election:TCreateElection, includeElection = false) => {
      try {
      const CreateEvent = await db.event.create({
         data:includeElection ? {
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            category: event.category,
            deleted: false,
            election:{
               create:{
                  electionName:election.electionName,
                  status:election.status,
                  voteEligibility:VotingEligibility.MIGS
               }
            }
         }:{
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            category: event.category,
            deleted: false,
         }
      })
      return CreateEvent
   } catch (error) {
      console.log(error);
   }
};

export const getEvent = async (eventId: number) => {
   try {
      return await db.event.findUnique({
         where: { id: eventId, deleted: false },
         include: { election: true, },
      });
   } catch (error) {
      console.log(error);
   }
};

export const getAllEvent = async (includeElection = false) => {
   try {
      return await db.event.findMany({
         where: {
            deleted: false,
         },
         orderBy: { createdAt: "desc" },
         select: {
            id: true,
            title: true,
            description: true,
            location: true,
            category: true,
            date: true,
            election: includeElection,
         },
      });
   } catch (error) {
      console.log(error);
   }
};

export const updateEvent = async (
   event: z.infer<typeof updateEventSchema>,
   eventId: number,
   userId?: number
) => {
   try {
      const updateEvent = await db.event.update({
         where: { id: eventId },
         data: {
            title: event.title,
            description: event.description,
            location: event.location,
            date: event.date,
            updatedBy: userId,
         },
      });
      return updateEvent;
   } catch (error) {
      console.log(error);
   }
};

export const deleteEvent = async (
   userId: number,
   eventId: number,
   isPermanentDelete = false
) => {
   try {
      if (isPermanentDelete) await db.event.delete({ where: { id: eventId } });
      return await db.event.update({
         where: { id: eventId },
         data: {
            deleted: true,
            deletedBy: userId,
         },
      });
   } catch (error) {
      console.log(error);
   }
};
