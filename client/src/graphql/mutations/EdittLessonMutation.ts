import { gql } from '@apollo/client';

export const EDIT_LESSON_MUTATION = gql`
  mutation EditALesson($input: LessonDetails) {
    editALesson(input: $input) {
      message
    }
  }
`;
