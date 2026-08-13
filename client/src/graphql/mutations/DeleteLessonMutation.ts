import { gql } from '@apollo/client';

export const DELETE_LESSON_MUTATION = gql`
  mutation DeleteALesson($input: DeleteLessonDetails!) {
    deleteALesson(input: $input) {
      message
    }
  }
`;
