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
});

export const SigninSchema = z.object({
    username: z
        .string()
        .min(5, "Username must be at least 5 characters long")
        .max(16, "Username cannot exceed 16 characters")
        .trim(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
});

export const CreateRoomSchema = z.object({
    name: z.string().trim().min(1, "Room name is required"),
});
