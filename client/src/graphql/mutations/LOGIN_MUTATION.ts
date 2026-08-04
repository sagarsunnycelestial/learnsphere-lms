import { gql, type TypedDocumentNode } from "@apollo/client";
import type { LoginMutationVariables, LoginResponse } from "../../types/types";


export const LOGIN_MUTATION:TypedDocumentNode<LoginResponse,LoginMutationVariables> = gql`mutation Login($input: LoginCredentials!) {
  login(input: $input) {
    accessToken
    profile_image_path
    role
  }
}`