import { gql } from '@apollo/client';

export const EDIT_COURSE_MUTATION = gql`
  mutation EditCourse($input: UpdateCourseDetails) {
    editCourse(input: $input) {
      message
    }
  }
`;
