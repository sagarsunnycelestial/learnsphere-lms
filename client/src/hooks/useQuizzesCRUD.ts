import { useMutation } from '@tanstack/react-query';
import { apolloClient } from '../graphql/apolloClient';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  CreateAQuestionDocument,
  CreateAQuestionMutationVariables,
  CreateAQuizDocument,
  CreateAQuizMutationVariables,
  DeleteQuestionDocument,
  DeleteQuestionMutationVariables,
  DeleteQuizDocument,
  DeleteQuizMutationVariables,
  SubmitQuizDocument,
  SubmitQuizMutationVariables,
} from '../generated/graphql';
import { useParams } from 'react-router';
export default function useQuizzesRUD() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { mutateAsync: addNewQuiz } = useMutation({
    mutationFn: async (input: CreateAQuizMutationVariables) => {
      const { data } = await apolloClient.mutate({
        mutation: CreateAQuizDocument,
        variables: input,
        fetchPolicy: 'network-only',
      });
      if (!data) {
        throw new Error('No response from server');
      }
      return data.createAQuiz;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['course', id],
      });
    },
    onError: () => {
      toast.error('Creating a quiz failed');
    },
  });
  const { mutateAsync: createAQuestion } = useMutation({
    mutationFn: async (input: CreateAQuestionMutationVariables) => {
      const { data } = await apolloClient.mutate({
        mutation: CreateAQuestionDocument,
        variables: input,
        fetchPolicy: 'network-only',
      });
      return data?.createAQuestion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['course', id],
      });
    },
    onError: () => {
      toast.error('Adding question failed');
    },
  });
  const { mutateAsync: submitQuizAnswers } = useMutation({
    mutationFn: async (input: SubmitQuizMutationVariables) => {
      const { data } = await apolloClient.mutate({
        mutation: SubmitQuizDocument,
        variables: input,
        fetchPolicy: 'network-only',
      });
      return data?.submitQuiz;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['course', id],
      });
    },
    onError: () => {
      toast.error('Submitting Quiz failed');
    },
  });
  const { mutateAsync: deleteQuiz } = useMutation({
    mutationFn: async (input: DeleteQuizMutationVariables) => {
      const { data } = await apolloClient.mutate({
        mutation: DeleteQuizDocument,
        variables: input,
        fetchPolicy: 'network-only',
      });
      return data?.deleteQuiz;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['course', id],
      });
    },
    onError: () => {
      toast.error('Deleting Quiz failed');
    },
  });
  const { mutateAsync: deleteQuestion } = useMutation({
    mutationFn: async (input: DeleteQuestionMutationVariables) => {
      const { data } = await apolloClient.mutate({
        mutation: DeleteQuestionDocument,
        variables: input,
        fetchPolicy: 'network-only',
      });
      return data?.deleteQuestion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['course', id],
      });
    },
    onError: () => {
      toast.error('Deleting Question failed');
    },
  });
  return { createAQuestion, addNewQuiz, submitQuizAnswers, deleteQuiz, deleteQuestion };
}
