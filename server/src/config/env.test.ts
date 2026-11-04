import { envSchema } from './env.js';
import { describe, expect, it, jest, afterEach } from '@jest/globals';

const REQUIRED_KEY = 'FB_PROJECT_ID';

describe('env schema', () => {
  const originalValue = process.env[REQUIRED_KEY];

  afterEach(() => {
    if (originalValue === undefined) {
      delete process.env[REQUIRED_KEY];
    } else {
      process.env[REQUIRED_KEY] = originalValue;
    }
  });

  it('parses and coerces the loaded environment', () => {
    expect(envSchema.DB_PORT).toBe(5432);
    expect(envSchema.PORT).toBe(4000);
    expect(envSchema.DB_SSL).toBe(true);
    expect(envSchema.ACCESS_TOKEN_SECRET).toBe('test-access-secret');
  });

  it('fails when a required variable is missing', async () => {
    delete process.env[REQUIRED_KEY];
    jest.resetModules();

    await expect(
      jest.isolateModulesAsync(async () => {
        await import('./env.js');
      })
    ).rejects.toThrow();
  });
});
