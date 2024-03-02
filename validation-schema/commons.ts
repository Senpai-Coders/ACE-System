import z from "zod";

export const passbookNumberSchema = z
    .string({
        invalid_type_error: "invalid passbook number",
        required_error: "passbook number is required",
    })
    .min(1, "passbook number must not be empty");

export const eventIdParamSchema = z.coerce.number({
    invalid_type_error: "invalid event id",
    required_error: "event id is required",
});

export const electionIdParamSchema = z.coerce.number({
    invalid_type_error: "invalid event electionId",
    required_error: "electionId is required",
});

export const validateBirthDay = z.coerce.date({
    invalid_type_error: "invalid birthday",
    required_error: "birthday is required for verification",
});

export const validateBirthdayString = z.string().refine((value) => {
    return /^(0[1-9]|1[0-2])(\/|-)(0[1-9]|1\d|2\d|3[01])(\/|-)(\d{4})$/.test(
        value
    );
}, "Invalid date format");