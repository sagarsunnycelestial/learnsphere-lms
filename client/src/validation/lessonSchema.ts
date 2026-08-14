import { z } from 'zod';

export const lessonSchema = z.object({
  lessonName: z
    .string()
    .trim()
    .min(3, 'Lesson name should be atleast 3 characters')
    .max(50, 'Lesson name should not exceed more than 50 characters'),
  description: z
    .string()
    .trim()
    .min(20, 'Description should have minimum 20 characters')
    .max(1000, 'Description should not exceed 1000 characters'),
});
