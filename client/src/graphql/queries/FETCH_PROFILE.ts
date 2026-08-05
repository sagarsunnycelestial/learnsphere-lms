import { gql } from "@apollo/client";

export const FETCH_ROLES = gql`
query FetchProfile {
  fetchProfile {
    collegeName
    courses {
      courseId
      courseName
      isActive
    }
    email
    profile_image_path
    results {
      quiz {
        quizName
        quizId
      }
      resultId
      score
    }
    role {
      roleId
      roleName
    }
    username
  }
}`
