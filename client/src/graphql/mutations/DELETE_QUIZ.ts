import { gql } from "@apollo/client";

export const DELETE_QUIZ = gql`mutation DeleteQuiz($quizId: String!) {
  deleteQuiz(quizId: $quizId) {
    message
  }
}` 