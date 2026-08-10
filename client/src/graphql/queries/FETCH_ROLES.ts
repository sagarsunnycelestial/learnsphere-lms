import { gql } from "@apollo/client";
import type { TypedDocumentNode } from "@apollo/client";
import type { FetchRoleResponse } from "../../types/types";

export const FETCH_ROLES:TypedDocumentNode<FetchRoleResponse> = gql`query FetchRoles {
  fetchRoles {
    roleId
    roleName
  }
}`