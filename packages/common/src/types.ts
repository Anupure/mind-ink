import { z } from "zod";

export const CreateUserSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    username: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" })
  }).strict()

  export const SigninSchema = z.object({
    username: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  });

export const CreateRoomSchema = z.object({
    name: z.string().trim().min(1, "Room name is required"),
}).strict();
