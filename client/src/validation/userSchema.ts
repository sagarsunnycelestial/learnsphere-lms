import {z} from 'zod'

export const userSchema = z.object({
  email: z.email(),

  password: z
    .string()
    .trim()
    .min(5, "Password must be at least 5 characters")
    .max(100, "Password cannot exceed 100 characters").optional(),

  username: z
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .max(20, "Username cannot exceed 20 characters"),

  collegeName: z
    .string()
    .trim()
    .min(3, "College name must be at least 3 characters")
    .max(50, "College name cannot exceed 50 characters"),
});