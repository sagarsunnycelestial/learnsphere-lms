import { gql } from '@apollo/client';

export const FETCH_SINGLE_COURSE = gql`
  query FetchCourseById($courseId: String!) {
    fetchCourseById(courseId: $courseId) {
      canModify
      courseId
      courseName
      createdBy {
        profile_image_path
        userId
        username
      }
      description
      enrollments {
        enrolledAt
        enrollmentId
        isActive
        user {
          collegeName
          email
          profile_image_path
          username
        }
      }
      isActive
      isEnrolled
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
        questions {
          options {
            optionId
            optionText
          }
          questionId
          questionText
        }
      }
      thumbnail_image_path
      totalEnrolled
      totalLessons
    }
  }
`;
