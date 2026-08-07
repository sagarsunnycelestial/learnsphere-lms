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
    "mutation CreateCourse($input: CourseDetails!) {\n  createCourse(input: $input) {\n    message\n  }\n}": typeof types.CreateCourseDocument,
    "mutation RegisterUser($input: UserDetails!) {\n  registerUser(input: $input) {\n    email\n    message\n    temp_password\n  }\n}": typeof types.RegisterUserDocument,
    "mutation DeleteCourse($courseId: String!) {\n  deleteCourse(courseId: $courseId) {\n    message\n  }\n}": typeof types.DeleteCourseDocument,
    "mutation EditCourse($input: UpdateCourseDetails) {\n  editCourse(input: $input) {\n    message\n  }\n}": typeof types.EditCourseDocument,
    "mutation Login($input: LoginCredentials!) {\n  login(input: $input) {\n    accessToken\n    profile_image_path\n    role\n  }\n}": typeof types.LoginDocument,
    "mutation Logout {\n  logout {\n    message\n  }\n}": typeof types.LogoutDocument,
    "mutation UpdateProfile($input: UpdateDetails!) {\n  updateProfile(input: $input) {\n    message\n  }\n}": typeof types.UpdateProfileDocument,
    "query FetchCourses {\n  fetchCourses {\n    courseId\n    courseName\n    description\n    isEnrolled\n    canModify\n    thumbnail_image_path\n    createdBy {\n      profile_image_path\n      userId\n      username\n    }\n    enrollments {\n    \n      enrolledAt\n      enrollmentId\n      isActive\n    }\n    isActive\n    lessons {\n      description\n      lessonId\n      lessonName\n      sortOrder\n      videoLink\n    }\n    quizzes {\n      quizId\n      quizName\n    }\n  }\n}": typeof types.FetchCoursesDocument,
    "\nquery FetchProfile {\n  fetchProfile {\n    collegeName\n    email\n    profile_image_path\n    results {\n      quiz {\n        quizId\n        quizName\n      }\n      resultId\n      score\n    }\n    role {\n      roleId\n      roleName\n    }\n    username\n    enrollments {\n      course {\n        courseId\n        courseName\n        isActive\n      }\n      enrolledAt\n      enrollmentId\n      isActive\n    }\n    courses {\n      courseName\n      isActive\n      courseId\n    }\n  }\n}": typeof types.FetchProfileDocument,
    "query FetchRoles {\n  fetchRoles {\n    roleId\n    roleName\n  }\n}": typeof types.FetchRolesDocument,
    "query FetchCourseById($courseId: String!) {\n  fetchCourseById(courseId: $courseId) {\n    canModify\n    courseId\n    courseName\n    createdBy {\n      profile_image_path\n      userId\n      username\n    }\n    description\n    enrollments {\n      enrolledAt\n      enrollmentId\n      isActive\n      user {\n        collegeName\n        email\n        profile_image_path\n        username\n      }\n    }\n    isActive\n    isEnrolled\n    lessons {\n      description\n      lessonId\n      lessonName\n      sortOrder\n      videoLink\n    }\n    quizzes {\n      quizId\n      quizName\n      questions {\n        options {\n          optionId\n          optionText\n        }\n        questionId\n        questionText\n      }\n    }\n    thumbnail_image_path\n    totalEnrolled\n    totalLessons\n  }\n}": typeof types.FetchCourseByIdDocument,
    "query RefreshEndpoint {\n  refreshEndpoint {\n    accessToken\n    profile_image_path\n    role\n  }\n}": typeof types.RefreshEndpointDocument,
};
const documents: Documents = {
    "mutation CreateCourse($input: CourseDetails!) {\n  createCourse(input: $input) {\n    message\n  }\n}": types.CreateCourseDocument,
    "mutation RegisterUser($input: UserDetails!) {\n  registerUser(input: $input) {\n    email\n    message\n    temp_password\n  }\n}": types.RegisterUserDocument,
    "mutation DeleteCourse($courseId: String!) {\n  deleteCourse(courseId: $courseId) {\n    message\n  }\n}": types.DeleteCourseDocument,
    "mutation EditCourse($input: UpdateCourseDetails) {\n  editCourse(input: $input) {\n    message\n  }\n}": types.EditCourseDocument,
    "mutation Login($input: LoginCredentials!) {\n  login(input: $input) {\n    accessToken\n    profile_image_path\n    role\n  }\n}": types.LoginDocument,
    "mutation Logout {\n  logout {\n    message\n  }\n}": types.LogoutDocument,
    "mutation UpdateProfile($input: UpdateDetails!) {\n  updateProfile(input: $input) {\n    message\n  }\n}": types.UpdateProfileDocument,
    "query FetchCourses {\n  fetchCourses {\n    courseId\n    courseName\n    description\n    isEnrolled\n    canModify\n    thumbnail_image_path\n    createdBy {\n      profile_image_path\n      userId\n      username\n    }\n    enrollments {\n    \n      enrolledAt\n      enrollmentId\n      isActive\n    }\n    isActive\n    lessons {\n      description\n      lessonId\n      lessonName\n      sortOrder\n      videoLink\n    }\n    quizzes {\n      quizId\n      quizName\n    }\n  }\n}": types.FetchCoursesDocument,
    "\nquery FetchProfile {\n  fetchProfile {\n    collegeName\n    email\n    profile_image_path\n    results {\n      quiz {\n        quizId\n        quizName\n      }\n      resultId\n      score\n    }\n    role {\n      roleId\n      roleName\n    }\n    username\n    enrollments {\n      course {\n        courseId\n        courseName\n        isActive\n      }\n      enrolledAt\n      enrollmentId\n      isActive\n    }\n    courses {\n      courseName\n      isActive\n      courseId\n    }\n  }\n}": types.FetchProfileDocument,
    "query FetchRoles {\n  fetchRoles {\n    roleId\n    roleName\n  }\n}": types.FetchRolesDocument,
    "query FetchCourseById($courseId: String!) {\n  fetchCourseById(courseId: $courseId) {\n    canModify\n    courseId\n    courseName\n    createdBy {\n      profile_image_path\n      userId\n      username\n    }\n    description\n    enrollments {\n      enrolledAt\n      enrollmentId\n      isActive\n      user {\n        collegeName\n        email\n        profile_image_path\n        username\n      }\n    }\n    isActive\n    isEnrolled\n    lessons {\n      description\n      lessonId\n      lessonName\n      sortOrder\n      videoLink\n    }\n    quizzes {\n      quizId\n      quizName\n      questions {\n        options {\n          optionId\n          optionText\n        }\n        questionId\n        questionText\n      }\n    }\n    thumbnail_image_path\n    totalEnrolled\n    totalLessons\n  }\n}": types.FetchCourseByIdDocument,
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
export function graphql(source: "mutation CreateCourse($input: CourseDetails!) {\n  createCourse(input: $input) {\n    message\n  }\n}"): (typeof documents)["mutation CreateCourse($input: CourseDetails!) {\n  createCourse(input: $input) {\n    message\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation RegisterUser($input: UserDetails!) {\n  registerUser(input: $input) {\n    email\n    message\n    temp_password\n  }\n}"): (typeof documents)["mutation RegisterUser($input: UserDetails!) {\n  registerUser(input: $input) {\n    email\n    message\n    temp_password\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation DeleteCourse($courseId: String!) {\n  deleteCourse(courseId: $courseId) {\n    message\n  }\n}"): (typeof documents)["mutation DeleteCourse($courseId: String!) {\n  deleteCourse(courseId: $courseId) {\n    message\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation EditCourse($input: UpdateCourseDetails) {\n  editCourse(input: $input) {\n    message\n  }\n}"): (typeof documents)["mutation EditCourse($input: UpdateCourseDetails) {\n  editCourse(input: $input) {\n    message\n  }\n}"];
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
export function graphql(source: "query FetchCourses {\n  fetchCourses {\n    courseId\n    courseName\n    description\n    isEnrolled\n    canModify\n    thumbnail_image_path\n    createdBy {\n      profile_image_path\n      userId\n      username\n    }\n    enrollments {\n    \n      enrolledAt\n      enrollmentId\n      isActive\n    }\n    isActive\n    lessons {\n      description\n      lessonId\n      lessonName\n      sortOrder\n      videoLink\n    }\n    quizzes {\n      quizId\n      quizName\n    }\n  }\n}"): (typeof documents)["query FetchCourses {\n  fetchCourses {\n    courseId\n    courseName\n    description\n    isEnrolled\n    canModify\n    thumbnail_image_path\n    createdBy {\n      profile_image_path\n      userId\n      username\n    }\n    enrollments {\n    \n      enrolledAt\n      enrollmentId\n      isActive\n    }\n    isActive\n    lessons {\n      description\n      lessonId\n      lessonName\n      sortOrder\n      videoLink\n    }\n    quizzes {\n      quizId\n      quizName\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\nquery FetchProfile {\n  fetchProfile {\n    collegeName\n    email\n    profile_image_path\n    results {\n      quiz {\n        quizId\n        quizName\n      }\n      resultId\n      score\n    }\n    role {\n      roleId\n      roleName\n    }\n    username\n    enrollments {\n      course {\n        courseId\n        courseName\n        isActive\n      }\n      enrolledAt\n      enrollmentId\n      isActive\n    }\n    courses {\n      courseName\n      isActive\n      courseId\n    }\n  }\n}"): (typeof documents)["\nquery FetchProfile {\n  fetchProfile {\n    collegeName\n    email\n    profile_image_path\n    results {\n      quiz {\n        quizId\n        quizName\n      }\n      resultId\n      score\n    }\n    role {\n      roleId\n      roleName\n    }\n    username\n    enrollments {\n      course {\n        courseId\n        courseName\n        isActive\n      }\n      enrolledAt\n      enrollmentId\n      isActive\n    }\n    courses {\n      courseName\n      isActive\n      courseId\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FetchRoles {\n  fetchRoles {\n    roleId\n    roleName\n  }\n}"): (typeof documents)["query FetchRoles {\n  fetchRoles {\n    roleId\n    roleName\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query FetchCourseById($courseId: String!) {\n  fetchCourseById(courseId: $courseId) {\n    canModify\n    courseId\n    courseName\n    createdBy {\n      profile_image_path\n      userId\n      username\n    }\n    description\n    enrollments {\n      enrolledAt\n      enrollmentId\n      isActive\n      user {\n        collegeName\n        email\n        profile_image_path\n        username\n      }\n    }\n    isActive\n    isEnrolled\n    lessons {\n      description\n      lessonId\n      lessonName\n      sortOrder\n      videoLink\n    }\n    quizzes {\n      quizId\n      quizName\n      questions {\n        options {\n          optionId\n          optionText\n        }\n        questionId\n        questionText\n      }\n    }\n    thumbnail_image_path\n    totalEnrolled\n    totalLessons\n  }\n}"): (typeof documents)["query FetchCourseById($courseId: String!) {\n  fetchCourseById(courseId: $courseId) {\n    canModify\n    courseId\n    courseName\n    createdBy {\n      profile_image_path\n      userId\n      username\n    }\n    description\n    enrollments {\n      enrolledAt\n      enrollmentId\n      isActive\n      user {\n        collegeName\n        email\n        profile_image_path\n        username\n      }\n    }\n    isActive\n    isEnrolled\n    lessons {\n      description\n      lessonId\n      lessonName\n      sortOrder\n      videoLink\n    }\n    quizzes {\n      quizId\n      quizName\n      questions {\n        options {\n          optionId\n          optionText\n        }\n        questionId\n        questionText\n      }\n    }\n    thumbnail_image_path\n    totalEnrolled\n    totalLessons\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query RefreshEndpoint {\n  refreshEndpoint {\n    accessToken\n    profile_image_path\n    role\n  }\n}"): (typeof documents)["query RefreshEndpoint {\n  refreshEndpoint {\n    accessToken\n    profile_image_path\n    role\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;