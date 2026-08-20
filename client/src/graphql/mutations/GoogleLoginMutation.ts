import { gql } from '@apollo/client';

export const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($input: GoogleLoginInput!) {
    googleLogin(input: $input) {
      accessToken
      profile_image_path
      role
    }
  }
`;
