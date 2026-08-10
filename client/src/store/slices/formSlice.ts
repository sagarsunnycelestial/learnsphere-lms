import { createSlice } from "@reduxjs/toolkit";
import { type FormInitialState } from "../../types/types";

const initialState: FormInitialState = {
  users: {
    mode: "add",
    isUserAddFormOpen: false,
    selectedUser: null,
    createdUser: {
      didValueReceive: false,
      email: "",
      temp_password: "",
    },
  },
  courses: {
    mode: "add",
    isAddCourseFormOpen: false,
    selectedcourse: null,
  },
  lessons: {
    mode: "add",
    isLessonFormOpen: false,
    selectedLesson: null,
  },
  quizzes: {
    mode: "add",
    isQuizFormOpen: false,
    selectedQuiz: null,
  },
  questions: {
    mode: "add",
    isQuestionFormOpen: false,
    quizId: null,
  },
  results: {
    submitted: false,
    quizResult: null,
  },
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    userAddFormControl(state, action) {
      const { mode, isUserAddFormOpen, selectedUser } = action.payload;
      state.users.isUserAddFormOpen = isUserAddFormOpen;
      state.users.mode = mode;
      state.users.selectedUser = selectedUser;
    },
    addCourseFormControl(state, action) {
      const { mode, isAddCourseFormOpen, selectedcourse } = action.payload;
      state.courses.isAddCourseFormOpen = isAddCourseFormOpen;
      state.courses.mode = mode;
      state.courses.selectedcourse = selectedcourse;
    },
    storeInfo(state, action) {
      const { email, pswrd, open } = action.payload;
      state.users.createdUser.email = email;
      state.users.createdUser.temp_password = pswrd;
      state.users.createdUser.didValueReceive = open;
    },
    lessonFormControl(state, action) {
      const { mode, isLessonFormOpen, selectedLesson } = action.payload;
      state.lessons.isLessonFormOpen = isLessonFormOpen;
      state.lessons.mode = mode;
      state.lessons.selectedLesson = selectedLesson;
    },
    quizFormControl(state, action) {
      const { mode, isQuizFormOpen, selectedQuiz } = action.payload;
      state.quizzes.isQuizFormOpen = isQuizFormOpen;
      state.quizzes.mode = mode;
      state.quizzes.selectedQuiz = selectedQuiz;
    },
    questionFormControl(state, action) {
      const { mode, isQuestionFormOpen, quizId } = action.payload;
      state.questions.isQuestionFormOpen = isQuestionFormOpen;
      state.questions.mode = mode;
      state.questions.quizId = quizId;
    },
    resultDisplay(state, action) {
      const { quizResult, submitted } = action.payload;
      state.results.submitted = submitted;
      state.results.quizResult = quizResult;
    },
  },
});

export const {
  userAddFormControl,
  addCourseFormControl,
  storeInfo,
  lessonFormControl,
  questionFormControl,
  quizFormControl,
  resultDisplay,
} = formSlice.actions;
export default formSlice.reducer;
