/* eslint-disable */

import { ApolloLogginPlugin } from './apolloLoggingPlugin.js';
import { logger } from './logger.js';
import { describe, expect, it, jest, beforeEach } from '@jest/globals';

jest.mock('./logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

const mockedLogger = jest.mocked(logger);

function buildResponse(errors: unknown[] = []) {
  return {
    body: {
      kind: 'single',
      singleResult: { errors },
    },
  } as any;
}

describe('ApolloLogginPlugin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('logs the start and successful finish of an operation', async () => {
    const listener = await ApolloLogginPlugin.requestDidStart!({
      request: { operationName: 'FetchCourses' },
      contextValue: { user: { user_id: 'user-1' } },
    } as any);

    expect(mockedLogger.info).toHaveBeenCalledWith(
      'GraphQL operation started',
      { operationName: 'FetchCourses', userId: 'user-1' }
    );

    await (listener as any).willSendResponse({
      response: buildResponse(),
    } as any);

    expect(mockedLogger.info).toHaveBeenCalledWith(
      'GraphQL operation finished',
      expect.objectContaining({ status: 'ok', operationName: 'FetchCourses' })
    );
  });

  it('falls back to an anonymous operation name', async () => {
    await ApolloLogginPlugin.requestDidStart!({
      request: {},
      contextValue: {},
    } as any);

    expect(mockedLogger.info).toHaveBeenCalledWith(
      'GraphQL operation started',
      { operationName: 'anonymous', userId: undefined }
    );
  });

  it('logs encountered errors', async () => {
    const listener = await ApolloLogginPlugin.requestDidStart!({
      request: { operationName: 'Broken' },
      contextValue: {},
    } as any);

    await (listener as any).didEncounterErrors({
      errors: [{ message: 'failed', path: ['fetchCourses'] }],
    } as any);

    expect(mockedLogger.error).toHaveBeenCalledWith(
      'GraphQL operation failed',
      {
        operationName: 'Broken',
        message: 'failed',
        path: ['fetchCourses'],
      }
    );
  });

  it('marks the finish as an error when the response has errors', async () => {
    const listener = await ApolloLogginPlugin.requestDidStart!({
      request: { operationName: 'Broken' },
      contextValue: {},
    } as any);

    await (listener as any).willSendResponse({
      response: buildResponse([{ message: 'failed' }]),
    } as any);

    expect(mockedLogger.info).toHaveBeenCalledWith(
      'GraphQL operation finished',
      expect.objectContaining({ status: 'error' })
    );
  });

  it('handles incremental responses without errors', async () => {
    const listener = await ApolloLogginPlugin.requestDidStart!({
      request: { operationName: 'Incremental' },
      contextValue: {},
    } as any);

    await (listener as any).willSendResponse({
      response: { body: { kind: 'incremental' } },
    } as any);

    expect(mockedLogger.info).toHaveBeenCalledWith(
      'GraphQL operation finished',
      expect.objectContaining({ status: 'ok' })
    );
  });
});
