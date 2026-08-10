import { gql } from "@apollo/client";

export const DELETE_COURSE_MUTATION = gql`mutation DeleteCourse($courseId: String!) {
  deleteCourse(courseId: $courseId) {
    message
  }
}`