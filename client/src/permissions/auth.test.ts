import { describe, expect, it } from 'vitest';
import { hasPermission } from './auth';

const admin = {
  accessToken: 'token',
  role: 'Admin' as const,
  isAuthenticated: true,
};
const instructor = {
  accessToken: 'token',
  role: 'Instructor' as const,
  isAuthenticated: true,
};
const student = {
  accessToken: 'token',
  role: 'Student' as const,
  isAuthenticated: true,
};

describe('hasPermission', () => {
  it('grants admin-only permissions to admins', () => {
    expect(hasPermission(admin, 'create:user')).toBe(true);
    expect(hasPermission(admin, 'delete:user')).toBe(true);
    expect(hasPermission(admin, 'edit all:courses')).toBe(true);
  });

  it('denies admin-only permissions to other roles', () => {
    expect(hasPermission(instructor, 'create:user')).toBe(false);
    expect(hasPermission(student, 'delete:user')).toBe(false);
  });

  it('grants instructor permissions to instructors', () => {
    expect(hasPermission(instructor, 'create:course')).toBe(true);
    expect(hasPermission(instructor, 'create:quiz')).toBe(true);
    expect(hasPermission(instructor, 'view:profile')).toBe(true);
  });

  it('grants student permissions to students', () => {
    expect(hasPermission(student, 'course:enroll')).toBe(true);
    expect(hasPermission(student, 'submit:quiz')).toBe(true);
    expect(hasPermission(student, 'view:profile')).toBe(true);
  });

  it('denies student permissions to instructors', () => {
    expect(hasPermission(instructor, 'submit:quiz')).toBe(false);
  });
});
