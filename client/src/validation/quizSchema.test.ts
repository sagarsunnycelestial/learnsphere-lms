import { describe, expect, it } from 'vitest';
import { quizSchema } from './quizSchema';

describe('quizSchema', () => {
  it('accepts a valid quiz name', () => {
    expect(quizSchema.safeParse({ quizName: 'Basics' }).success).toBe(true);
  });

  it('rejects a short quiz name', () => {
    expect(quizSchema.safeParse({ quizName: 'ab' }).success).toBe(false);
  });

  it('rejects a quiz name longer than fifty characters', () => {
    expect(quizSchema.safeParse({ quizName: 'a'.repeat(51) }).success).toBe(
      false
    );
  });

  it('trims the quiz name', () => {
    expect(quizSchema.parse({ quizName: '  Basics  ' }).quizName).toBe(
      'Basics'
    );
  });
});
