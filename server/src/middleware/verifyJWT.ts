import jwt from 'jsonwebtoken';
import { AuthPayload } from '../../types/types.js';
import { envSchema } from '../config/env.js';
export default function verifyJWT(token: string) {
  const secret = envSchema.ACCESS_TOKEN_SECRET;
  const decoded = jwt.verify(token, secret) as AuthPayload;
  return decoded;
}
