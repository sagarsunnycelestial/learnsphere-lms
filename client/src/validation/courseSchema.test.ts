import { describe, expect, it } from 'vitest';
import { courseSchema } from './courseSchema';

describe('courseSchema', () => {
  const valid = {
    courseName: 'Intro to Testing',
    description: 'A course about writing reliable unit tests',
  };

  it('accepts a valid course', () => {
    expect(courseSchema.safeParse(valid).success).toBe(true);
  });

  it('trims values before validating', () => {
    const result = courseSchema.parse({
      ...valid,
      courseName: '  Trimmed  ',
    });

    expect(result.courseName).toBe('Trimmed');
  });

  it('rejects a short course name', () => {
    const result = courseSchema.safeParse({ ...valid, courseName: 'ab' });

    expect(result.success).toBe(false);
  });

  it('rejects a short description', () => {
    const result = courseSchema.safeParse({
      ...valid,
      description: 'too short',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an overlong course name', () => {
    const result = courseSchema.safeParse({
      ...valid,
      courseName: 'a'.repeat(51),
    });

    expect(result.success).toBe(false);
  });

  it('allows optional thumbnail and status fields', () => {
    const result = courseSchema.safeParse({
      ...valid,
      thumbnail_image_path: null,
      isActive: false,
      courseId: 'course-1',
    });

    expect(result.success).toBe(true);
  });
});
