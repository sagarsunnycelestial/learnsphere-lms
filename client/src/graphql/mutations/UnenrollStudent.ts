import { gql } from '@apollo/client';

export const UNENROLL_STUDENT = gql`
  mutation UnenrollStudent($input: EnrollDetails) {
    unenrollStudent(input: $input) {
      message
    }
  }
`;
