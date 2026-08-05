import { gql } from "@apollo/client";

export const UPDATE_PROFILE_MUTATION= gql`mutation UpdateProfile($input: UpdateDetails!) {
  updateProfile(input: $input) {
    message
  }
}`