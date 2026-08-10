import { gql,type TypedDocumentNode } from "@apollo/client";
import type { RegisterMutationInput, RegisterResponse } from "../../types/types";

export const ADD_USER_MUTATION:TypedDocumentNode<RegisterResponse,RegisterMutationInput> = gql`mutation RegisterUser($input: UserDetails!) {
  registerUser(input: $input) {
    email
    message
    temp_password
  }
}`

