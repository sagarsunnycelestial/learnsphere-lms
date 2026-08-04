import { gql } from "@apollo/client";


export const LOGIN_MUTATION = gql`mutation Login($input: LoginCredentials!) {
  login(input: $input) {
    accessToken
    profile_image_path
    role
  }
}`