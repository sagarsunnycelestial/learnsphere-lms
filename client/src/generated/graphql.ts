/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AnswerInput = {
  questionId?: string | null | undefined;
  selectionOption?: string | null | undefined;
};

export type CourseDetails = {
  courseName?: string | null | undefined;
  description?: string | null | undefined;
  thumbnail_image_path?: string | null | undefined;
};

export type DeleteLessonDetails = {
  courseId?: string | null | undefined;
  lessonId?: string | null | undefined;
};

export type EnrollDetails = {
  courseId: string;
  userId?: string | null | undefined;
};

export type LessonDetails = {
  courseId: string;
  description?: string | null | undefined;
  lessonId?: string | null | undefined;
  lessonName: string;
  sortOrder?: number | null | undefined;
  videoLink?: string | null | undefined;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type QuestionDetails = {
  correctOption?: number | null | undefined;
  optionFour?: string | null | undefined;
  optionOne?: string | null | undefined;
  optionThree?: string | null | undefined;
  optionTwo?: string | null | undefined;
  questionText?: string | null | undefined;
  quizId?: string | null | undefined;
};

export type QuizAnswerDetails = {
  answerList?: Array<AnswerInput | null | undefined> | null | undefined;
  quizId?: string | null | undefined;
};

export type QuizDetails = {
  courseId: string;
  quizName: string;
};

export type UpdateCourseDetails = {
  courseId?: string | null | undefined;
  courseName?: string | null | undefined;
  description?: string | null | undefined;
  isActive?: boolean | null | undefined;
  thumbnail_image_path?: string | null | undefined;
};

export type UpdateDetails = {
  collegeName: string;
  email: string;
  password: string;
  profile_image_path?: string | null | undefined;
  username: string;
};

export type UserDetails = {
  collegeName: string;
  email: string;
  profile_image_path?: string | null | undefined;
  role: string;
  username: string;
};

export type CreateCourseMutationVariables = Exact<{
  input: CourseDetails;
}>;


export type CreateCourseMutation = { createCourse: { message: string } };

export type AddALessonMutationVariables = Exact<{
  input?: LessonDetails | null | undefined;
}>;


export type AddALessonMutation = { addALesson: { message: string } };

export type CreateAQuestionMutationVariables = Exact<{
  input?: QuestionDetails | null | undefined;
}>;


export type CreateAQuestionMutation = { createAQuestion: { message: string } };

export type CreateAQuizMutationVariables = Exact<{
  input?: QuizDetails | null | undefined;
}>;


export type CreateAQuizMutation = { createAQuiz: { message: string } };

export type RegisterUserMutationVariables = Exact<{
  input: UserDetails;
}>;


export type RegisterUserMutation = { registerUser: { email: string, message: string, temp_password: string } };

export type DeleteCourseMutationVariables = Exact<{
  courseId: string;
}>;


export type DeleteCourseMutation = { deleteCourse: { message: string } };

export type DeleteALessonMutationVariables = Exact<{
  input: DeleteLessonDetails;
}>;


export type DeleteALessonMutation = { deleteALesson: { message: string } };

export type EditCourseMutationVariables = Exact<{
  input?: UpdateCourseDetails | null | undefined;
}>;


export type EditCourseMutation = { editCourse: { message: string } };

export type EditALessonMutationVariables = Exact<{
  input?: LessonDetails | null | undefined;
}>;


export type EditALessonMutation = { editALesson: { message: string } };

export type EnrollCourseMutationVariables = Exact<{
  input?: EnrollDetails | null | undefined;
}>;


export type EnrollCourseMutation = { enrollCourse: { message: string } };

export type LoginMutationVariables = Exact<{
  input: LoginCredentials;
}>;


export type LoginMutation = { login: { accessToken: string | null, profile_image_path: string | null, role: string | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: { message: string } | null };

export type SubmitQuizMutationVariables = Exact<{
  input?: QuizAnswerDetails | null | undefined;
}>;


export type SubmitQuizMutation = { submitQuiz: { message: string | null, profile_image_path: string | null, quizId: string | null, quizName: string | null, resultId: string | null, score: number | null, userId: string | null, username: string | null, courseDetail: { courseId: string | null, courseName: string | null, isActive: boolean | null } | null } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateDetails;
}>;


export type UpdateProfileMutation = { updateProfile: { message: string } };

export type FetchCoursesQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchCoursesQuery = { fetchCourses: Array<{ courseId: string | null, courseName: string | null, description: string | null, isEnrolled: boolean | null, canModify: boolean | null, thumbnail_image_path: string | null, isActive: boolean | null, createdBy: { profile_image_path: string | null, userId: string | null, username: string | null } | null, enrollments: Array<{ enrolledAt: string | null, enrollmentId: string | null, isActive: boolean | null } | null> | null, lessons: Array<{ description: string | null, lessonId: string | null, lessonName: string | null, sortOrder: number | null, videoLink: string | null } | null> | null, quizzes: Array<{ quizId: string | null, quizName: string | null } | null> | null } | null> | null };

export type FetchProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchProfileQuery = { fetchProfile: { collegeName: string, email: string, profile_image_path: string | null, username: string, results: Array<{ resultId: string | null, score: number | null, quiz: { quizId: string | null, quizName: string | null } | null } | null> | null, role: { roleId: string | null, roleName: string | null } | null, enrollments: Array<{ enrolledAt: string | null, enrollmentId: string | null, isActive: boolean | null, course: { courseId: string | null, courseName: string | null, isActive: boolean | null } | null } | null> | null, courses: Array<{ courseName: string | null, isActive: boolean | null, courseId: string | null } | null> | null } | null };

export type FetchRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchRolesQuery = { fetchRoles: Array<{ roleId: string | null, roleName: string | null } | null> | null };

export type FetchCourseByIdQueryVariables = Exact<{
  courseId: string;
}>;


export type FetchCourseByIdQuery = { fetchCourseById: { canModify: boolean | null, courseId: string | null, courseName: string | null, description: string | null, isActive: boolean | null, isEnrolled: boolean | null, thumbnail_image_path: string | null, totalEnrolled: number | null, totalLessons: number | null, createdBy: { profile_image_path: string | null, userId: string | null, username: string | null } | null, enrollments: Array<{ enrolledAt: string | null, enrollmentId: string | null, isActive: boolean | null, user: { collegeName: string, email: string, profile_image_path: string | null, username: string } | null } | null> | null, lessons: Array<{ description: string | null, lessonId: string | null, lessonName: string | null, sortOrder: number | null, videoLink: string | null } | null> | null, quizzes: Array<{ quizId: string | null, quizName: string | null, questions: Array<{ questionId: string | null, questionText: string | null, options: Array<{ optionId: string | null, optionText: string | null } | null> | null } | null> | null } | null> | null } };

export type FetchStudentsQueryVariables = Exact<{
  courseId?: string | null | undefined;
}>;


export type FetchStudentsQuery = { fetchStudents: Array<{ userId: string, collegeName: string, email: string, isEnrolled: boolean | null, profile_image_path: string | null, username: string, results: Array<{ resultId: string | null, score: number | null } | null> | null } | null> | null };

export type RefreshEndpointQueryVariables = Exact<{ [key: string]: never; }>;


export type RefreshEndpointQuery = { refreshEndpoint: { accessToken: string | null, profile_image_path: string | null, role: string | null } | null };


export const CreateCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CourseDetails"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateCourseMutation, CreateCourseMutationVariables>;
export const AddALessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddALesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LessonDetails"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addALesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<AddALessonMutation, AddALessonMutationVariables>;
export const CreateAQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"QuestionDetails"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateAQuestionMutation, CreateAQuestionMutationVariables>;
export const CreateAQuizDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAQuiz"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"QuizDetails"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAQuiz"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CreateAQuizMutation, CreateAQuizMutationVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserDetails"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"temp_password"}}]}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const DeleteCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteCourseMutation, DeleteCourseMutationVariables>;
export const DeleteALessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteALesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteLessonDetails"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteALesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteALessonMutation, DeleteALessonMutationVariables>;
export const EditCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCourseDetails"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<EditCourseMutation, EditCourseMutationVariables>;
export const EditALessonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditALesson"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"LessonDetails"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editALesson"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<EditALessonMutation, EditALessonMutationVariables>;
export const EnrollCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EnrollCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollDetails"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<EnrollCourseMutation, EnrollCourseMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginCredentials"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"profile_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const SubmitQuizDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitQuiz"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"QuizAnswerDetails"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitQuiz"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"courseDetail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"courseName"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profile_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"quizId"}},{"kind":"Field","name":{"kind":"Name","value":"quizName"}},{"kind":"Field","name":{"kind":"Name","value":"resultId"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]} as unknown as DocumentNode<SubmitQuizMutation, SubmitQuizMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDetails"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const FetchCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchCourses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fetchCourses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"courseName"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"isEnrolled"}},{"kind":"Field","name":{"kind":"Name","value":"canModify"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profile_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrollments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrolledAt"}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"lessonName"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"videoLink"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quizzes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quizId"}},{"kind":"Field","name":{"kind":"Name","value":"quizName"}}]}}]}}]}}]} as unknown as DocumentNode<FetchCoursesQuery, FetchCoursesQueryVariables>;
export const FetchProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fetchProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collegeName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"profile_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quiz"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quizId"}},{"kind":"Field","name":{"kind":"Name","value":"quizName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"resultId"}},{"kind":"Field","name":{"kind":"Name","value":"score"}}]}},{"kind":"Field","name":{"kind":"Name","value":"role"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"enrollments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"courseName"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrolledAt"}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courses"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseName"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}}]}}]}}]}}]} as unknown as DocumentNode<FetchProfileQuery, FetchProfileQueryVariables>;
export const FetchRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fetchRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roleId"}},{"kind":"Field","name":{"kind":"Name","value":"roleName"}}]}}]}}]} as unknown as DocumentNode<FetchRolesQuery, FetchRolesQueryVariables>;
export const FetchCourseByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchCourseById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fetchCourseById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canModify"}},{"kind":"Field","name":{"kind":"Name","value":"courseId"}},{"kind":"Field","name":{"kind":"Name","value":"courseName"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"profile_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"enrollments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrolledAt"}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentId"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collegeName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"profile_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"isEnrolled"}},{"kind":"Field","name":{"kind":"Name","value":"lessons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"lessonId"}},{"kind":"Field","name":{"kind":"Name","value":"lessonName"}},{"kind":"Field","name":{"kind":"Name","value":"sortOrder"}},{"kind":"Field","name":{"kind":"Name","value":"videoLink"}}]}},{"kind":"Field","name":{"kind":"Name","value":"quizzes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quizId"}},{"kind":"Field","name":{"kind":"Name","value":"quizName"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"optionId"}},{"kind":"Field","name":{"kind":"Name","value":"optionText"}}]}},{"kind":"Field","name":{"kind":"Name","value":"questionId"}},{"kind":"Field","name":{"kind":"Name","value":"questionText"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"totalEnrolled"}},{"kind":"Field","name":{"kind":"Name","value":"totalLessons"}}]}}]}}]} as unknown as DocumentNode<FetchCourseByIdQuery, FetchCourseByIdQueryVariables>;
export const FetchStudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FetchStudents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fetchStudents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"collegeName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"isEnrolled"}},{"kind":"Field","name":{"kind":"Name","value":"profile_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resultId"}},{"kind":"Field","name":{"kind":"Name","value":"score"}}]}}]}}]}}]} as unknown as DocumentNode<FetchStudentsQuery, FetchStudentsQueryVariables>;
export const RefreshEndpointDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RefreshEndpoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshEndpoint"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"profile_image_path"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<RefreshEndpointQuery, RefreshEndpointQueryVariables>;