import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z
        .string()
        .trim()
        .email("Invalid email format"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Za-z]/, "Password must contain at least one letter")
        .regex(/\d/, "Password must contain at least one number"),
    name: z.string().trim().min(1, "Name is required"),
}).strict();

export const SigninSchema = z.object({
    username: z
        .string()
        .trim()
        .email("Invalid email format"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
}).strict();

export const CreateRoomSchema = z.object({
    name: z.string().trim().min(1, "Room name is required"),
}).strict();
