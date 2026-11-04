import { describe, expect, it } from 'vitest';
import { lessonSchema } from './lessonSchema';

describe('lessonSchema', () => {
  const valid = {
    lessonName: 'First Lesson',
    description: 'A description with more than twenty characters',
  };

  it('accepts a valid lesson', () => {
    expect(lessonSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a short lesson name', () => {
    expect(lessonSchema.safeParse({ ...valid, lessonName: 'ab' }).success).toBe(
      false
    );
  });

  it('rejects a description shorter than twenty characters', () => {
    expect(
      lessonSchema.safeParse({ ...valid, description: 'short' }).success
    ).toBe(false);
  });

  it('trims the lesson name', () => {
    expect(
      lessonSchema.parse({ ...valid, lessonName: '  Padded  ' }).lessonName
    ).toBe('Padded');
  });
});
