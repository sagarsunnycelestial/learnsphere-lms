import {z} from 'zod'

export const questionSchema = z.object({
  questionText:z.string().trim().min(3,'Question should have atleast 3 characters').max(50,'Question should not exceed more than 50 characters'),
  correctOption:z.string().trim().min(3,'Option should have atleast 3 characters').max(50,'Option should not exceed more than 50 characters'),
   options: z
    .array(
      z
        .string()
        .trim()
        .min(3, 'Each option should have at least 3 characters')
        .max(50, 'Each option should not exceed 50 characters')
    )
    .min(2, 'You must provide at least 2 options')
    .max(4, 'You can have at most 4 options'),
})