import 'dotenv/config'
import {z} from 'zod'

export const envSchema = z.object({
DB_TYPE:z.enum(['postgres']),
DB_HOST: z.string(),
DB_PORT: z.coerce.number(),
DB_USERNAME: z.string(),
DB_NAME: z.string(),
DB_PASSWORD:z.string(),
ACCESS_TOKEN_SECRET: z.string(),
REFRESH_TOKEN_SECRET:z.string(),
PORT:z.coerce.number()
}).parse(process.env)