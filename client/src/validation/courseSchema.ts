import { z } from 'zod';

export const courseSchema = z.object({
  courseName: z
    .string()
    .trim()
    .min(3, 'Course name should be atleast 3 characters')
    .max(50, 'Course name should not exceed 50 characters'),
  description: z
    .string()
    .trim()
    .min(10, 'Description should have minimum 10 characters')
    .max(1000, 'Description should not exceed 1000 characters'),
  thumbnail_image_path: z.string().nullable().optional(),

  isActive: z.boolean().optional(),

  courseId: z.string().optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;
