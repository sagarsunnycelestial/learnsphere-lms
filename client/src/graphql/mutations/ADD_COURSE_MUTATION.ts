import { gql } from "@apollo/client";

export const ADD_COURSE_MUTATION = gql`mutation CreateCourse($input: CourseDetails!) {
  createCourse(input: $input) {
    message
  }
}`