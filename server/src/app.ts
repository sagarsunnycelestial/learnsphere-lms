import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { corsOptions } from './config/corsOptions.js';
import { expressMiddleware } from '@as-integrations/express5';
import server from './graphql/apolloServer.js';
import errorHandler from './middleware/errorHandler.js';
import verifyJWT from './middleware/verifyJWT.js';

export const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      let user = null;
      const authHeader = req.headers['authorization'];
      if (authHeader?.startsWith('Bearer')) {
        const token = authHeader.split(' ')[1];
        try {
          if (typeof token === 'string') {
            user = verifyJWT(token);
          }
        } catch {
          user = null;
        }
      }
      return { req, res, user };
    },
  })
);

app.use(errorHandler);
