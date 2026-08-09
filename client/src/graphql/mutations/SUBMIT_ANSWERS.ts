import { gql } from "@apollo/client";

export const SUBMIT_ANSWERS = gql`mutation SubmitQuiz($input: QuizAnswerDetails) {
  submitQuiz(input: $input) {
    message
    courseDetail {
      courseId
      courseName
      isActive
    }
    profile_image_path
    quizId
    quizName
    resultId
    score
    userId
    username
  }
}`