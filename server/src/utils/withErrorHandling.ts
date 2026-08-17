import { GraphQLError } from 'graphql';
import { logger } from '../config/logger.js';

export function withErrorHandling<Args extends unknown[], Return>(
  fn: (...args: Args) => Promise<Return>,
  fallbackMessage: string
): (...args: Args) => Promise<Return> {
  return async (...args: Args) => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err instanceof GraphQLError) {
        throw err;
      }
      logger.error(fallbackMessage, {
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      });
      throw new GraphQLError(fallbackMessage);
    }
  };
}
