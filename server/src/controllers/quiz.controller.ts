import { GraphQLError } from 'graphql';
import { Context, QuestionArgs, SubmitQuizArgs } from '../../types/types.js';
import { UserRoles } from '../../types/types.js';
import {
  userRepo,
  courseRepo,
  questionRepo,
  quizRepo,
  resultRepo,
  optionRepo,
} from '../entities/repos.js';
import { ERROR_MESSAGES } from '../constants/messages.js';
import { withErrorHandling } from '../utils/withErrorHandling.js';

async function createAQuizForCourseRaw(
  args: {
    input: {
      courseId: string;
      quizName: string;
    };
  },
  context: Context
) {
  if (!context.user?.user_id || !args.input.courseId)
    throw new GraphQLError(ERROR_MESSAGES.COURSES_ID_INVALID);
  const course = await courseRepo.findOne({
    where: {
      courseId: args.input.courseId,
      ...(context.user.role !== UserRoles.ADMIN
        ? { createdBy: { userId: context.user.user_id } }
        : {}),
    },
  });
  if (!course) throw new GraphQLError(ERROR_MESSAGES.COURSES_NOT_FOUND);

  const newQuiz = quizRepo.create({
    quizName: args.input.quizName,
    course: course,
  });
  await quizRepo.save(newQuiz);
  return { message: 'Quiz created successfully' };
}
async function createAQuestionForQuizRaw(args: QuestionArgs, context: Context) {
  if (!context.user?.user_id || !args.input.quizId)
    throw new GraphQLError(ERROR_MESSAGES.QUIZ_ID_INVALID);
  const { options, correctOption, questionText } = args.input;
  if (!questionText || !correctOption)
    throw new GraphQLError(ERROR_MESSAGES.QUESTION_NOT_CREATED);

  const quiz = await quizRepo.findOne({
    where: {
      quizId: args.input.quizId,
    },
  });
  if (!quiz) {
    throw new GraphQLError(ERROR_MESSAGES.QUESTION_NOT_CREATED);
  }

  const question = questionRepo.create({
    questionText: questionText,
    quiz: quiz,
  });
  await questionRepo.save(question);
  const correctAnswer = optionRepo.create({
    optionText: correctOption,
    question: question,
  });
  const optionEntities = options.map((option) =>
    optionRepo.create({
      optionText: option,
      question,
    })
  );
  await optionRepo.save([...optionEntities, correctAnswer]);

  await optionRepo.save(correctAnswer);
  question.correctOption = correctAnswer;
  await questionRepo.save(question);
  return { message: 'Question and options created successfully' };
}

async function submitQuizAnswersRaw(args: SubmitQuizArgs, context: Context) {
  if (!context.user?.user_id || !args.input.quizId)
    throw new GraphQLError(ERROR_MESSAGES.QUIZ_ID_INVALID);

  const user = await userRepo.findOne({
    where: {
      userId: context.user.user_id,
    },
    relations: {
      results: true,
    },
  });
  if (!args.input.answerList?.length)
    throw new GraphQLError(ERROR_MESSAGES.QUIZ_SUBMIT_FAILED);
  const questionIds = args.input.answerList.map((a) => a.questionId);
  const hasDuplicates = new Set(questionIds).size !== questionIds.length;
  if (hasDuplicates) throw new GraphQLError(ERROR_MESSAGES.QUIZ_HAS_DUPLICATES);
  if (!user) throw new GraphQLError(ERROR_MESSAGES.USER_NOT_FOUND);
  const quiz = await quizRepo.findOne({
    where: {
      quizId: args.input.quizId,
    },
    relations: {
      questions: {
        options: true,
        correctOption: true,
      },
      course: true,
    },
  });
  if (!quiz) throw new GraphQLError(ERROR_MESSAGES.QUIZ_ID_INVALID);

  const questionsInQuiz = quiz.questions;
  const total_questions = quiz.questions.length;
  const result = args.input.answerList?.reduce(
    (acc, question) => {
      const correctQuestion = questionsInQuiz.find((q) => {
        return q.questionId === question.questionId;
      });
      if (
        question.selectionOption != null &&
        question.selectionOption === correctQuestion?.correctOption?.optionId
      )
        return {
          ...acc,
          [question.questionId as string]: true,
          score: acc.score + 1,
        };

      return {
        ...acc,
        [question.questionId as string]: false,
        score: acc.score,
      };
    },
    { score: 0 }
  );
  const score = Number(((result.score / total_questions) * 100).toFixed(2));
  const quizResult = resultRepo.create({
    quiz: quiz,
    user: user,
    score: score || 0,
  });
  await resultRepo.save(quizResult);
  user.results.push(quizResult);
  await userRepo.save(user);
  if (result) {
    return {
      message: 'Submitted quiz answers successfully',
      courseDetail: {
        courseId: quiz.course.courseId,
        courseName: quiz.course.courseName,
        isActive: quiz.course.isActive,
      },
      userId: user.userId,
      username: user.username,
      profile_image_path: user.profile_image_path,
      resultId: quizResult.resultId,
      quizId: quiz.quizId,
      quizName: quiz.quizName,
      score: quizResult.score,
    };
  }
  throw new GraphQLError(ERROR_MESSAGES.QUIZ_SUBMIT_FAILED);
}

async function deleteQuizWithIDRaw(quizId: string, context: Context) {
  let quizToDelete = null;
  if (context.user) {
    quizToDelete = await quizRepo.findOne({
      where: {
        quizId: quizId,
        course: {
          ...(context.user.role !== UserRoles.ADMIN
            ? { createdBy: { userId: context.user.user_id } }
            : {}),
        },
      },
    });
  }

  if (!quizToDelete) throw new GraphQLError(ERROR_MESSAGES.QUIZ_NOT_FOUND);

  await quizRepo.remove(quizToDelete);
  return { message: 'Quiz deleted successfully' };
}

async function deleteQuestionWithIDRaw(input: {
  questionId: string;
  quizId: string;
  userId: string;
}) {
  const questionToDelete = await questionRepo.findOne({
    where: {
      questionId: input.questionId,
      quiz: {
        quizId: input.quizId,
      },
    },
  });
  if (!questionToDelete)
    throw new GraphQLError(ERROR_MESSAGES.QUESTION_NOT_DELETE);

  await questionRepo.remove(questionToDelete);
  return {
    message: 'Question deleted successfully',
  };
}

export const createAQuizForCourse = withErrorHandling(
  createAQuizForCourseRaw,
  ERROR_MESSAGES.QUIZ_NOT_CREATED
);
export const createAQuestionForQuiz = withErrorHandling(
  createAQuestionForQuizRaw,
  ERROR_MESSAGES.QUESTION_NOT_CREATED
);
export const submitQuizAnswers = withErrorHandling(
  submitQuizAnswersRaw,
  ERROR_MESSAGES.QUIZ_SUBMIT_FAILED
);
export const deleteQuizWithID = withErrorHandling(
  deleteQuizWithIDRaw,
  ERROR_MESSAGES.QUIZ_NOT_DELETE
);
export const deleteQuestionWithID = withErrorHandling(
  deleteQuestionWithIDRaw,
  ERROR_MESSAGES.QUESTION_NOT_DELETE
);
