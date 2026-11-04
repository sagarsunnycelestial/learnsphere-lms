import { describe, expect, it } from 'vitest';
import { userSchema } from './userSchema';

describe('userSchema', () => {
  const valid = {
    email: 'user@test.com',
    username: 'testuser',
    collegeName: 'Test College',
  };

  it('accepts a valid user without a password', () => {
    expect(userSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts a valid password', () => {
    expect(userSchema.safeParse({ ...valid, password: 'secret' }).success).toBe(
      true
    );
  });

  it('rejects an invalid email', () => {
    expect(
      userSchema.safeParse({ ...valid, email: 'not-an-email' }).success
    ).toBe(false);
  });

  it('rejects a short username', () => {
    expect(userSchema.safeParse({ ...valid, username: 'abc' }).success).toBe(
      false
    );
  });

  it('rejects a short college name', () => {
    expect(userSchema.safeParse({ ...valid, collegeName: 'ab' }).success).toBe(
      false
    );
  });

  it('rejects a short password', () => {
    expect(userSchema.safeParse({ ...valid, password: 'abc' }).success).toBe(
      false
    );
  });
});
