/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation RegisterUser($input: UserDetails!) {\n  registerUser(input: $input) {\n    email\n    message\n    temp_password\n  }\n}": typeof types.RegisterUserDocument,
    "mutation Login($input: LoginCredentials!) {\n  login(input: $input) {\n    accessToken\n    profile_image_path\n    role\n  }\n}": typeof types.LoginDocument,
    "mutation Logout {\n  logout {\n    message\n  }\n}": typeof types.LogoutDocument,
    "mutation UpdateProfile($input: UpdateDetails!) {\n  updateProfile(input: $input) {\n    message\n  }\n}": typeof types.UpdateProfileDocument,
    "\nquery FetchProfile {\n  fetchProfile {\n    collegeName\n    courses {\n      courseId\n      courseName\n      isActive\n    }\n    email\n    profile_image_path\n    results {\n      quiz {\n        quizName\n        quizId\n      }\n      resultId\n      score\n    }\n    role {\n      roleId\n      roleName\n    }\n    username\n  }\n}": typeof types.FetchProfileDocument,
    "query FetchRoles {\n  fetchRoles {\n    roleId\n    roleName\n  }\n}": typeof types.FetchRolesDocument,
    "query RefreshEndpoint {\n  refreshEndpoint {\n    accessToken\n    profile_image_path\n    role\n  }\n}": typeof types.RefreshEndpointDocument,
};
const documents: Documents = {
    "mutation RegisterUser($input: UserDetails!) {\n  registerUser(input: $input) {\n    email\n    message\n    temp_password\n  }\n}": types.RegisterUserDocument,
    "mutation Login($input: LoginCredentials!) {\n  login(input: $input) {\n    accessToken\n    profile_image_path\n    role\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout {\n    message\n  }\n}": types.LogoutDocument,
    "mutation UpdateProfile($input: UpdateDetails!) {\n  updateProfile(input: $input) {\n    message\n  }\n}": types.UpdateProfileDocument,
    "\nquery FetchProfile {\n  fetchProfile {\n    collegeName\n    courses {\n      courseId\n      courseName\n      isActive\n    }\n    email\n    profile_image_path\n    results {\n      quiz {\n        quizName\n        quizId\n      }\n      resultId\n      score\n    }\n    role {\n      roleId\n      roleName\n    }\n    username\n  }\n}": types.FetchProfileDocument,
    "query FetchRoles {\n  fetchRoles {\n    roleId\n    roleName\n  }\n}": types.FetchRolesDocument,
    "query RefreshEndpoint {\n  refreshEndpoint {\n    accessToken\n    profile_image_path\n    role\n  }\n}": types.RefreshEndpointDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RegisterUser($input: UserDetails!) {\n  registerUser(input: $input) {\n    email\n    message\n    temp_password\n  }\n}"): (typeof documents)["mutation RegisterUser($input: UserDetails!) {\n  registerUser(input: $input) {\n    email\n    message\n    temp_password\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Login($input: LoginCredentials!) {\n  login(input: $input) {\n    accessToken\n    profile_image_path\n    role\n  }\n}"): (typeof documents)["mutation Login($input: LoginCredentials!) {\n  login(input: $input) {\n    accessToken\n    profile_image_path\n    role\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Logout {\n  logout {\n    message\n  }\n}"): (typeof documents)["mutation Logout {\n  logout {\n    message\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateProfile($input: UpdateDetails!) {\n  updateProfile(input: $input) {\n    message\n  }\n}"): (typeof documents)["mutation UpdateProfile($input: UpdateDetails!) {\n  updateProfile(input: $input) {\n    message\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery FetchProfile {\n  fetchProfile {\n    collegeName\n    courses {\n      courseId\n      courseName\n      isActive\n    }\n    email\n    profile_image_path\n    results {\n      quiz {\n        quizName\n        quizId\n      }\n      resultId\n      score\n    }\n    role {\n      roleId\n      roleName\n    }\n    username\n  }\n}"): (typeof documents)["\nquery FetchProfile {\n  fetchProfile {\n    collegeName\n    courses {\n      courseId\n      courseName\n      isActive\n    }\n    email\n    profile_image_path\n    results {\n      quiz {\n        quizName\n        quizId\n      }\n      resultId\n      score\n    }\n    role {\n      roleId\n      roleName\n    }\n    username\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FetchRoles {\n  fetchRoles {\n    roleId\n    roleName\n  }\n}"): (typeof documents)["query FetchRoles {\n  fetchRoles {\n    roleId\n    roleName\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query RefreshEndpoint {\n  refreshEndpoint {\n    accessToken\n    profile_image_path\n    role\n  }\n}"): (typeof documents)["query RefreshEndpoint {\n  refreshEndpoint {\n    accessToken\n    profile_image_path\n    role\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;