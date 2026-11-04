import { describe, expect, it } from 'vitest';
import { questionSchema } from './questionSchema';

describe('questionSchema', () => {
  const valid = {
    questionText: 'What is two plus two?',
    correctOption: 'Four',
    options: ['Four', 'Three'],
  };

  it('accepts a valid question', () => {
    expect(questionSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a question that is too short', () => {
    expect(
      questionSchema.safeParse({ ...valid, questionText: 'hi' }).success
    ).toBe(false);
  });

  it('rejects a short correct option', () => {
    expect(
      questionSchema.safeParse({ ...valid, correctOption: 'x' }).success
    ).toBe(false);
  });

  it('rejects more than four options', () => {
    expect(
      questionSchema.safeParse({
        ...valid,
        options: ['one', 'two', 'three', 'four', 'five'],
      }).success
    ).toBe(false);
  });

  it('rejects a short option', () => {
    expect(
      questionSchema.safeParse({ ...valid, options: ['ok', 'no'] }).success
    ).toBe(false);
  });

  it('rejects an empty option list', () => {
    expect(questionSchema.safeParse({ ...valid, options: [] }).success).toBe(
      false
    );
  });
});
