import 'dotenv/config'
import {z} from 'zod'

export const envSchema = z.object({
DB_TYPE:z.enum(['postgres']),
DB_HOST: z.string(),
DB_PORT: z.coerce.number(),
DB_USERNAME: z.string(),
DB_NAME: z.string(),
SUPABASE_DB_URL: z.string(),
DB_PASSWORD:z.string(),
DB_SSL: z.coerce.boolean().default(true),
ACCESS_TOKEN_SECRET: z.string(),
REFRESH_TOKEN_SECRET:z.string(),
PORT:z.coerce.number(),
SUPABASE_DB_URL: z.string(),
ALLOWED_ORIGIN1:z.string(),
ALLOWED_ORIGIN2:z.string(),
}).parse(process.env)