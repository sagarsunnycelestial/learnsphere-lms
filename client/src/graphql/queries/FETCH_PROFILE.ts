import { gql } from "@apollo/client";

export const FETCH_PROFILE = gql`
query FetchProfile {
  fetchProfile {
    collegeName
    email
    profile_image_path
    results {
      quiz {
        quizId
        quizName
      }
      resultId
      score
    }
    role {
      roleId
      roleName
    }
    username
    enrollments {
      course {
        courseId
        courseName
        isActive
      }
      enrolledAt
      enrollmentId
      isActive
    }
    courses {
      courseName
      isActive
      courseId
    }
  }
}`
