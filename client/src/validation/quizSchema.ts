import {z} from 'zod'


export const quizSchema = z.object({
  quizName:z.string().trim().min(3,'Quiz name should have atleast 3 characters').max(50,'Quiz name should not exceed more than 50 characters')
})