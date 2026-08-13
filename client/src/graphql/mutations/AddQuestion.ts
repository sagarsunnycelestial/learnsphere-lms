import { gql } from '@apollo/client';

export const ADD_QUESTION = gql`
  mutation CreateAQuestion($input: QuestionDetails) {
    createAQuestion(input: $input) {
      message
    }
  }
`;
