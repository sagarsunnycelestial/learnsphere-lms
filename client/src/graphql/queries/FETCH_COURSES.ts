import { gql } from "@apollo/client";

export const FETCH_COURSES = gql`query FetchCourses {
  fetchCourses {
    courseId
    courseName
    createdBy {
      profile_image_path
      userId
      userName
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
}`