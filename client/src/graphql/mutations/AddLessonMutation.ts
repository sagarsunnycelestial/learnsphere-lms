import { gql } from '@apollo/client';

export const ADD_LESSON_MUTATION = gql`
  mutation AddALesson($input: LessonDetails) {
    addALesson(input: $input) {
      message
    }
  }
`;
