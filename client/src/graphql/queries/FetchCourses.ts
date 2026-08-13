import { gql } from '@apollo/client';

export const FETCH_COURSES = gql`
  query FetchCourses {
    fetchCourses {
      courseId
      courseName
      description
      isEnrolled
      canModify
      thumbnail_image_path
      createdBy {
        profile_image_path
        userId
        username
      }
      enrollments {
        enrolledAt
        enrollmentId
        isActive
      }
      isActive
      lessons {
        description
        lessonId
        lessonName
        sortOrder
        videoLink
      }
      quizzes {
        quizId
        quizName
      }
    }
  }
`;
