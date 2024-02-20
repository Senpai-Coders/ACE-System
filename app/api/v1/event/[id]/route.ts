import { currentUserOrThrowAuthError } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { deleteEvent, getEvent, updateEvent } from "../_services/events";
import { updateEventSchema } from "@/validation-schema/event";
import { validateId} from "@/lib/server-utils";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { ZodError, z } from "zod";
import { TUpdateEvent } from "@/types";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
   try {
      const id = Number(params.id);
      validateId(id);
      const getUniqueEvent = await getEvent(id);
      return NextResponse.json(getUniqueEvent);
   } catch (e) {
      console.log(e);
      return routeErrorHandler(e, req.method);
   }
};

export const PATCH = async (req: NextRequest, { params }: TParams) => {
   try {
      const id = Number(params.id);
      validateId(id);
      const data:TUpdateEvent = await req.json();
      const user = await currentUserOrThrowAuthError();
      updateEventSchema.parse(data);
      const UpdateEvent = await updateEvent(data, id ,user.id);
      return NextResponse.json(UpdateEvent);
   } catch (e) {
      return routeErrorHandler(e, req.method);
   }
};

export const DELETE = async (req: NextRequest, { params }: TParams) => {
   try {
      const id = Number(params.id);
      validateId(id);
      const user = await currentUserOrThrowAuthError();
      const softDeleleteEvent = await deleteEvent(user.id, id);
      return NextResponse.json(softDeleleteEvent);
   } catch (e) {
      return routeErrorHandler(e, req.method);
   }
};
