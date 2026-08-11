import { gql } from '@apollo/client';

export const ENROLL_STUDENT = gql`
  mutation EnrollCourse($input: EnrollDetails) {
    enrollCourse(input: $input) {
      message
    }
  }
`;
