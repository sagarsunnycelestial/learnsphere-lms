import { cert, getApps, initializeApp } from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { envSchema } from './env.js';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: envSchema.FB_PROJECT_ID,
      privateKey: envSchema.FB_PRIVATE_KEY,
      clientEmail: envSchema.FB_CLIENT_EMAIL,
    }),
  });
}

export const firebaseAdminAuth = getAuth();
