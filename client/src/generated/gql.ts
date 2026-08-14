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
    "\n  mutation CreateCourse($input: CourseDetails!) {\n    createCourse(input: $input) {\n      message\n    }\n  }\n": typeof types.CreateCourseDocument,
    "\n  mutation AddALesson($input: LessonDetails) {\n    addALesson(input: $input) {\n      message\n    }\n  }\n": typeof types.AddALessonDocument,
    "\n  mutation CreateAQuestion($input: QuestionDetails) {\n    createAQuestion(input: $input) {\n      message\n    }\n  }\n": typeof types.CreateAQuestionDocument,
    "\n  mutation CreateAQuiz($input: QuizDetails) {\n    createAQuiz(input: $input) {\n      message\n    }\n  }\n": typeof types.CreateAQuizDocument,
    "\n  mutation RegisterUser($input: UserDetails!) {\n    registerUser(input: $input) {\n      email\n      message\n      temp_password\n    }\n  }\n": typeof types.RegisterUserDocument,
    "\n  mutation DeleteALesson($input: DeleteLessonDetails!) {\n    deleteALesson(input: $input) {\n      message\n    }\n  }\n": typeof types.DeleteALessonDocument,
    "\n  mutation DeleteQuestion($questionId: String!, $quizId: String!) {\n    deleteQuestion(questionId: $questionId, quizId: $quizId) {\n      message\n    }\n  }\n": typeof types.DeleteQuestionDocument,
    "\n  mutation DeleteQuiz($quizId: String!) {\n    deleteQuiz(quizId: $quizId) {\n      message\n    }\n  }\n": typeof types.DeleteQuizDocument,
    "\n  mutation EditCourse($input: UpdateCourseDetails) {\n    editCourse(input: $input) {\n      message\n    }\n  }\n": typeof types.EditCourseDocument,
    "\n  mutation EditALesson($input: LessonDetails) {\n    editALesson(input: $input) {\n      message\n    }\n  }\n": typeof types.EditALessonDocument,
    "\n  mutation EnrollCourse($input: EnrollDetails) {\n    enrollCourse(input: $input) {\n      message\n    }\n  }\n": typeof types.EnrollCourseDocument,
    "\n  mutation Login($input: LoginCredentials!) {\n    login(input: $input) {\n      accessToken\n      profile_image_path\n      role\n    }\n  }\n": typeof types.LoginDocument,
    "\n  mutation Logout {\n    logout {\n      message\n    }\n  }\n": typeof types.LogoutDocument,
    "\n  mutation SubmitQuiz($input: QuizAnswerDetails) {\n    submitQuiz(input: $input) {\n      message\n      courseDetail {\n        courseId\n        courseName\n        isActive\n      }\n      profile_image_path\n      quizId\n      quizName\n      resultId\n      score\n      userId\n      username\n    }\n  }\n": typeof types.SubmitQuizDocument,
    "mutation UnenrollStudent($input: EnrollDetails) {\n  unenrollStudent(input: $input) {\n    message\n  }\n}": typeof types.UnenrollStudentDocument,
    "\n  mutation UpdateProfile($input: UpdateDetails!) {\n    updateProfile(input: $input) {\n      message\n    }\n  }\n": typeof types.UpdateProfileDocument,
    "\n  mutation DeleteCourse($courseId: String!) {\n    deleteCourse(courseId: $courseId) {\n      message\n    }\n  }\n": typeof types.DeleteCourseDocument,
    "\n query FetchCourses($filter: CoursesFilter!) {\n  fetchCourses(filter: $filter) {\n      courseId\n      courseName\n      description\n      isEnrolled\n      canModify\n      thumbnail_image_path\n      createdBy {\n        profile_image_path\n        userId\n        username\n      }\n      enrollments {\n        enrolledAt\n        enrollmentId\n        isActive\n      }\n      isActive\n      lessons {\n        description\n        lessonId\n        lessonName\n        sortOrder\n        videoLink\n      }\n      quizzes {\n        quizId\n        quizName\n      }\n    }\n  }\n": typeof types.FetchCoursesDocument,
    "\n  query FetchProfile {\n    fetchProfile {\n      collegeName\n      email\n      profile_image_path\n      results {\n        quiz {\n          quizId\n          quizName\n        }\n        resultId\n        score\n      }\n      role {\n        roleId\n        roleName\n      }\n      username\n      enrollments {\n        course {\n          courseId\n          courseName\n          isActive\n        }\n        enrolledAt\n        enrollmentId\n        isActive\n      }\n      courses {\n        courseName\n        isActive\n        courseId\n      }\n    }\n  }\n": typeof types.FetchProfileDocument,
    "\n  query FetchRoles {\n    fetchRoles {\n      roleId\n      roleName\n    }\n  }\n": typeof types.FetchRolesDocument,
    "\n  query FetchCourseById($courseId: String!) {\n    fetchCourseById(courseId: $courseId) {\n      canModify\n      courseId\n      courseName\n      createdBy {\n        profile_image_path\n        userId\n        username\n      }\n      description\n      enrollments {\n        enrolledAt\n        enrollmentId\n        isActive\n        user {\n          userId\n          collegeName\n          email\n          profile_image_path\n          username\n        }\n      }\n      isActive\n      isEnrolled\n      lessons {\n        description\n        lessonId\n        lessonName\n        sortOrder\n        videoLink\n      }\n      quizzes {\n        quizId\n        quizName\n        questions {\n          options {\n            optionId\n            optionText\n          }\n          questionId\n          questionText\n        }\n      }\n      thumbnail_image_path\n      totalEnrolled\n      totalLessons\n    }\n  }\n": typeof types.FetchCourseByIdDocument,
    "\n  query FetchStudents($courseId: String) {\n    fetchStudents(courseId: $courseId) {\n      userId\n      collegeName\n      email\n      isEnrolled\n      profile_image_path\n      username\n      results {\n        resultId\n        score\n      }\n    }\n  }\n": typeof types.FetchStudentsDocument,
    "\n  query RefreshEndpoint {\n    refreshEndpoint {\n      accessToken\n      profile_image_path\n      role\n    }\n  }\n": typeof types.RefreshEndpointDocument,
};
const documents: Documents = {
    "\n  mutation CreateCourse($input: CourseDetails!) {\n    createCourse(input: $input) {\n      message\n    }\n  }\n": types.CreateCourseDocument,
    "\n  mutation AddALesson($input: LessonDetails) {\n    addALesson(input: $input) {\n      message\n    }\n  }\n": types.AddALessonDocument,
    "\n  mutation CreateAQuestion($input: QuestionDetails) {\n    createAQuestion(input: $input) {\n      message\n    }\n  }\n": types.CreateAQuestionDocument,
    "\n  mutation CreateAQuiz($input: QuizDetails) {\n    createAQuiz(input: $input) {\n      message\n    }\n  }\n": types.CreateAQuizDocument,
    "\n  mutation RegisterUser($input: UserDetails!) {\n    registerUser(input: $input) {\n      email\n      message\n      temp_password\n    }\n  }\n": types.RegisterUserDocument,
    "\n  mutation DeleteALesson($input: DeleteLessonDetails!) {\n    deleteALesson(input: $input) {\n      message\n    }\n  }\n": types.DeleteALessonDocument,
    "\n  mutation DeleteQuestion($questionId: String!, $quizId: String!) {\n    deleteQuestion(questionId: $questionId, quizId: $quizId) {\n      message\n    }\n  }\n": types.DeleteQuestionDocument,
    "\n  mutation DeleteQuiz($quizId: String!) {\n    deleteQuiz(quizId: $quizId) {\n      message\n    }\n  }\n": types.DeleteQuizDocument,
    "\n  mutation EditCourse($input: UpdateCourseDetails) {\n    editCourse(input: $input) {\n      message\n    }\n  }\n": types.EditCourseDocument,
    "\n  mutation EditALesson($input: LessonDetails) {\n    editALesson(input: $input) {\n      message\n    }\n  }\n": types.EditALessonDocument,
    "\n  mutation EnrollCourse($input: EnrollDetails) {\n    enrollCourse(input: $input) {\n      message\n    }\n  }\n": types.EnrollCourseDocument,
    "\n  mutation Login($input: LoginCredentials!) {\n    login(input: $input) {\n      accessToken\n      profile_image_path\n      role\n    }\n  }\n": types.LoginDocument,
    "\n  mutation Logout {\n    logout {\n      message\n    }\n  }\n": types.LogoutDocument,
    "\n  mutation SubmitQuiz($input: QuizAnswerDetails) {\n    submitQuiz(input: $input) {\n      message\n      courseDetail {\n        courseId\n        courseName\n        isActive\n      }\n      profile_image_path\n      quizId\n      quizName\n      resultId\n      score\n      userId\n      username\n    }\n  }\n": types.SubmitQuizDocument,
    "mutation UnenrollStudent($input: EnrollDetails) {\n  unenrollStudent(input: $input) {\n    message\n  }\n}": types.UnenrollStudentDocument,
    "\n  mutation UpdateProfile($input: UpdateDetails!) {\n    updateProfile(input: $input) {\n      message\n    }\n  }\n": types.UpdateProfileDocument,
    "\n  mutation DeleteCourse($courseId: String!) {\n    deleteCourse(courseId: $courseId) {\n      message\n    }\n  }\n": types.DeleteCourseDocument,
    "\n query FetchCourses($filter: CoursesFilter!) {\n  fetchCourses(filter: $filter) {\n      courseId\n      courseName\n      description\n      isEnrolled\n      canModify\n      thumbnail_image_path\n      createdBy {\n        profile_image_path\n        userId\n        username\n      }\n      enrollments {\n        enrolledAt\n        enrollmentId\n        isActive\n      }\n      isActive\n      lessons {\n        description\n        lessonId\n        lessonName\n        sortOrder\n        videoLink\n      }\n      quizzes {\n        quizId\n        quizName\n      }\n    }\n  }\n": types.FetchCoursesDocument,
    "\n  query FetchProfile {\n    fetchProfile {\n      collegeName\n      email\n      profile_image_path\n      results {\n        quiz {\n          quizId\n          quizName\n        }\n        resultId\n        score\n      }\n      role {\n        roleId\n        roleName\n      }\n      username\n      enrollments {\n        course {\n          courseId\n          courseName\n          isActive\n        }\n        enrolledAt\n        enrollmentId\n        isActive\n      }\n      courses {\n        courseName\n        isActive\n        courseId\n      }\n    }\n  }\n": types.FetchProfileDocument,
    "\n  query FetchRoles {\n    fetchRoles {\n      roleId\n      roleName\n    }\n  }\n": types.FetchRolesDocument,
    "\n  query FetchCourseById($courseId: String!) {\n    fetchCourseById(courseId: $courseId) {\n      canModify\n      courseId\n      courseName\n      createdBy {\n        profile_image_path\n        userId\n        username\n      }\n      description\n      enrollments {\n        enrolledAt\n        enrollmentId\n        isActive\n        user {\n          userId\n          collegeName\n          email\n          profile_image_path\n          username\n        }\n      }\n      isActive\n      isEnrolled\n      lessons {\n        description\n        lessonId\n        lessonName\n        sortOrder\n        videoLink\n      }\n      quizzes {\n        quizId\n        quizName\n        questions {\n          options {\n            optionId\n            optionText\n          }\n          questionId\n          questionText\n        }\n      }\n      thumbnail_image_path\n      totalEnrolled\n      totalLessons\n    }\n  }\n": types.FetchCourseByIdDocument,
    "\n  query FetchStudents($courseId: String) {\n    fetchStudents(courseId: $courseId) {\n      userId\n      collegeName\n      email\n      isEnrolled\n      profile_image_path\n      username\n      results {\n        resultId\n        score\n      }\n    }\n  }\n": types.FetchStudentsDocument,
    "\n  query RefreshEndpoint {\n    refreshEndpoint {\n      accessToken\n      profile_image_path\n      role\n    }\n  }\n": types.RefreshEndpointDocument,
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
export function graphql(source: "\n  mutation CreateCourse($input: CourseDetails!) {\n    createCourse(input: $input) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCourse($input: CourseDetails!) {\n    createCourse(input: $input) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddALesson($input: LessonDetails) {\n    addALesson(input: $input) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation AddALesson($input: LessonDetails) {\n    addALesson(input: $input) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateAQuestion($input: QuestionDetails) {\n    createAQuestion(input: $input) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAQuestion($input: QuestionDetails) {\n    createAQuestion(input: $input) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateAQuiz($input: QuizDetails) {\n    createAQuiz(input: $input) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation CreateAQuiz($input: QuizDetails) {\n    createAQuiz(input: $input) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RegisterUser($input: UserDetails!) {\n    registerUser(input: $input) {\n      email\n      message\n      temp_password\n    }\n  }\n"): (typeof documents)["\n  mutation RegisterUser($input: UserDetails!) {\n    registerUser(input: $input) {\n      email\n      message\n      temp_password\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteALesson($input: DeleteLessonDetails!) {\n    deleteALesson(input: $input) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteALesson($input: DeleteLessonDetails!) {\n    deleteALesson(input: $input) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteQuestion($questionId: String!, $quizId: String!) {\n    deleteQuestion(questionId: $questionId, quizId: $quizId) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteQuestion($questionId: String!, $quizId: String!) {\n    deleteQuestion(questionId: $questionId, quizId: $quizId) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteQuiz($quizId: String!) {\n    deleteQuiz(quizId: $quizId) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteQuiz($quizId: String!) {\n    deleteQuiz(quizId: $quizId) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditCourse($input: UpdateCourseDetails) {\n    editCourse(input: $input) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation EditCourse($input: UpdateCourseDetails) {\n    editCourse(input: $input) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditALesson($input: LessonDetails) {\n    editALesson(input: $input) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation EditALesson($input: LessonDetails) {\n    editALesson(input: $input) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EnrollCourse($input: EnrollDetails) {\n    enrollCourse(input: $input) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation EnrollCourse($input: EnrollDetails) {\n    enrollCourse(input: $input) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Login($input: LoginCredentials!) {\n    login(input: $input) {\n      accessToken\n      profile_image_path\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation Login($input: LoginCredentials!) {\n    login(input: $input) {\n      accessToken\n      profile_image_path\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation Logout {\n    logout {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation Logout {\n    logout {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SubmitQuiz($input: QuizAnswerDetails) {\n    submitQuiz(input: $input) {\n      message\n      courseDetail {\n        courseId\n        courseName\n        isActive\n      }\n      profile_image_path\n      quizId\n      quizName\n      resultId\n      score\n      userId\n      username\n    }\n  }\n"): (typeof documents)["\n  mutation SubmitQuiz($input: QuizAnswerDetails) {\n    submitQuiz(input: $input) {\n      message\n      courseDetail {\n        courseId\n        courseName\n        isActive\n      }\n      profile_image_path\n      quizId\n      quizName\n      resultId\n      score\n      userId\n      username\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UnenrollStudent($input: EnrollDetails) {\n  unenrollStudent(input: $input) {\n    message\n  }\n}"): (typeof documents)["mutation UnenrollStudent($input: EnrollDetails) {\n  unenrollStudent(input: $input) {\n    message\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProfile($input: UpdateDetails!) {\n    updateProfile(input: $input) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProfile($input: UpdateDetails!) {\n    updateProfile(input: $input) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteCourse($courseId: String!) {\n    deleteCourse(courseId: $courseId) {\n      message\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteCourse($courseId: String!) {\n    deleteCourse(courseId: $courseId) {\n      message\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n query FetchCourses($filter: CoursesFilter!) {\n  fetchCourses(filter: $filter) {\n      courseId\n      courseName\n      description\n      isEnrolled\n      canModify\n      thumbnail_image_path\n      createdBy {\n        profile_image_path\n        userId\n        username\n      }\n      enrollments {\n        enrolledAt\n        enrollmentId\n        isActive\n      }\n      isActive\n      lessons {\n        description\n        lessonId\n        lessonName\n        sortOrder\n        videoLink\n      }\n      quizzes {\n        quizId\n        quizName\n      }\n    }\n  }\n"): (typeof documents)["\n query FetchCourses($filter: CoursesFilter!) {\n  fetchCourses(filter: $filter) {\n      courseId\n      courseName\n      description\n      isEnrolled\n      canModify\n      thumbnail_image_path\n      createdBy {\n        profile_image_path\n        userId\n        username\n      }\n      enrollments {\n        enrolledAt\n        enrollmentId\n        isActive\n      }\n      isActive\n      lessons {\n        description\n        lessonId\n        lessonName\n        sortOrder\n        videoLink\n      }\n      quizzes {\n        quizId\n        quizName\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FetchProfile {\n    fetchProfile {\n      collegeName\n      email\n      profile_image_path\n      results {\n        quiz {\n          quizId\n          quizName\n        }\n        resultId\n        score\n      }\n      role {\n        roleId\n        roleName\n      }\n      username\n      enrollments {\n        course {\n          courseId\n          courseName\n          isActive\n        }\n        enrolledAt\n        enrollmentId\n        isActive\n      }\n      courses {\n        courseName\n        isActive\n        courseId\n      }\n    }\n  }\n"): (typeof documents)["\n  query FetchProfile {\n    fetchProfile {\n      collegeName\n      email\n      profile_image_path\n      results {\n        quiz {\n          quizId\n          quizName\n        }\n        resultId\n        score\n      }\n      role {\n        roleId\n        roleName\n      }\n      username\n      enrollments {\n        course {\n          courseId\n          courseName\n          isActive\n        }\n        enrolledAt\n        enrollmentId\n        isActive\n      }\n      courses {\n        courseName\n        isActive\n        courseId\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FetchRoles {\n    fetchRoles {\n      roleId\n      roleName\n    }\n  }\n"): (typeof documents)["\n  query FetchRoles {\n    fetchRoles {\n      roleId\n      roleName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FetchCourseById($courseId: String!) {\n    fetchCourseById(courseId: $courseId) {\n      canModify\n      courseId\n      courseName\n      createdBy {\n        profile_image_path\n        userId\n        username\n      }\n      description\n      enrollments {\n        enrolledAt\n        enrollmentId\n        isActive\n        user {\n          userId\n          collegeName\n          email\n          profile_image_path\n          username\n        }\n      }\n      isActive\n      isEnrolled\n      lessons {\n        description\n        lessonId\n        lessonName\n        sortOrder\n        videoLink\n      }\n      quizzes {\n        quizId\n        quizName\n        questions {\n          options {\n            optionId\n            optionText\n          }\n          questionId\n          questionText\n        }\n      }\n      thumbnail_image_path\n      totalEnrolled\n      totalLessons\n    }\n  }\n"): (typeof documents)["\n  query FetchCourseById($courseId: String!) {\n    fetchCourseById(courseId: $courseId) {\n      canModify\n      courseId\n      courseName\n      createdBy {\n        profile_image_path\n        userId\n        username\n      }\n      description\n      enrollments {\n        enrolledAt\n        enrollmentId\n        isActive\n        user {\n          userId\n          collegeName\n          email\n          profile_image_path\n          username\n        }\n      }\n      isActive\n      isEnrolled\n      lessons {\n        description\n        lessonId\n        lessonName\n        sortOrder\n        videoLink\n      }\n      quizzes {\n        quizId\n        quizName\n        questions {\n          options {\n            optionId\n            optionText\n          }\n          questionId\n          questionText\n        }\n      }\n      thumbnail_image_path\n      totalEnrolled\n      totalLessons\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query FetchStudents($courseId: String) {\n    fetchStudents(courseId: $courseId) {\n      userId\n      collegeName\n      email\n      isEnrolled\n      profile_image_path\n      username\n      results {\n        resultId\n        score\n      }\n    }\n  }\n"): (typeof documents)["\n  query FetchStudents($courseId: String) {\n    fetchStudents(courseId: $courseId) {\n      userId\n      collegeName\n      email\n      isEnrolled\n      profile_image_path\n      username\n      results {\n        resultId\n        score\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query RefreshEndpoint {\n    refreshEndpoint {\n      accessToken\n      profile_image_path\n      role\n    }\n  }\n"): (typeof documents)["\n  query RefreshEndpoint {\n    refreshEndpoint {\n      accessToken\n      profile_image_path\n      role\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;