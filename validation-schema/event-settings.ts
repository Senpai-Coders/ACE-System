import z from "zod";
import { MemberSearchMode } from "@prisma/client";

export const eventRegistrationSettingsSchema = z.object({
    registrationOnEvent: z.boolean({
        invalid_type_error: "invalid registration settings",
        required_error: "registration setting is required",
    }),
});

export const memberSearchOptionEnums = z.nativeEnum(MemberSearchMode);