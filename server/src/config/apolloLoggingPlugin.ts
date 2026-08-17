import { Context } from '../../types/types.js';
import { logger } from './logger.js';
import type { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';

export const ApolloLogginPlugin: ApolloServerPlugin = {
  async requestDidStart({ request, contextValue }): Promise<GraphQLRequestListener<Context>> {
    const startTime = Date.now();
    const operationName = request.operationName ?? 'anonymous';

    logger.info('GraphQL operation started', {
      operationName,
      userId: (contextValue as Context)?.user?.user_id,
    });
    return {
      async didEncounterErrors({ errors }) {
        for (const error of errors) {
          logger.error('GraphQL operation failed', {
            operationName,
            message: error.message,
            path: error.path,
          });
        }
      },
      async willSendResponse({ response }) {
        const durationMs = Date.now() - startTime;
        const hasErrors =
          response.body.kind === 'single' &&
          Array.isArray(response.body.singleResult.errors) &&
          response.body.singleResult.errors.length > 0;

        logger.info('GraphQL operation finished', {
          operationName,
          status: hasErrors ? 'error' : 'ok',
          durationMs,
        });
      },
    };
  },
};
