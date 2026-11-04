export const testUser = {
  accessToken: 'test-access-token',
  role: 'Admin',
  isAuthenticated: true,
  profile_image_path: '/avatar.png',
};

export const studentUser = {
  accessToken: 'student-token',
  role: 'Student',
  isAuthenticated: true,
  profile_image_path: null,
};

export const testCourse = {
  courseId: 'course-1',
  courseName: 'Test Course',
  description: 'A course used in tests',
  thumbnail_image_path: '/thumb.png',
  isActive: true,
  isEnrolled: false,
  canModify: true,
  createdBy: {
    userId: 'user-1',
    username: 'admin',
    profile_image_path: '/avatar.png',
  },
  lessons: [],
  quizzes: [],
  enrollments: [],
};

export const testLesson = {
  lessonId: 'lesson-1',
  lessonName: 'Test Lesson',
  description: 'A lesson used in tests',
  videoLink: 'https://example.com/video.mp4',
  sortOrder: 1,
};

export const testQuiz = {
  quizId: 'quiz-1',
  quizName: 'Test Quiz',
  questions: [],
};

export const testQuizResult = {
  message: 'Submitted quiz answers successfully',
  courseDetail: {
    courseId: 'course-1',
    courseName: 'Test Course',
    isActive: true,
  },
  userId: 'user-1',
  username: 'student',
  profile_image_path: '/avatar.png',
  resultId: 'result-1',
  quizId: 'quiz-1',
  quizName: 'Test Quiz',
  score: 80,
};
