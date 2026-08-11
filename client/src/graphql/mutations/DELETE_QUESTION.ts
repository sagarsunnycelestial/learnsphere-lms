import { gql } from "@apollo/client";

export const DELETE_QUESTION =gql`mutation DeleteQuestion($questionId: String!, $quizId: String!) {
  deleteQuestion(questionId: $questionId, quizId: $quizId) {
    message
  }
}`