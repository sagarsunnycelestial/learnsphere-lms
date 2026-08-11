import { gql } from '@apollo/client';

export const FETCH_STUDENTS = gql`
  query FetchStudents($courseId: String) {
    fetchStudents(courseId: $courseId) {
      userId
      collegeName
      email
      isEnrolled
      profile_image_path
      username
      results {
        resultId
        score
      }
    }
  }
`;
