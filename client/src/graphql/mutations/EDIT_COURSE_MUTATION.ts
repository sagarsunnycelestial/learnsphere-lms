import { gql } from "@apollo/client";

export const EDIT_COURSE_MUTATION = gql`mutation Mutation($input: UpdateCourseDetails) {
  editCourse(input: $input) {
    message
  }
}`