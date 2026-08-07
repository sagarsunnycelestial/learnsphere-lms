import { gql } from "@apollo/client";

export const ENROLL_STUDENT = gql`mutation Mutation($input: EnrollDetails) {
  enrollCourse(input: $input) {
    message
  }
}`