import { gql } from '@apollo/client';

export const ADD_QUIZ = gql`
  mutation CreateAQuiz($input: QuizDetails) {
    createAQuiz(input: $input) {
      message
    }
  }
`;
