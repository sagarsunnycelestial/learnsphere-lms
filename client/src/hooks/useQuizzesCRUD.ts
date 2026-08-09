import { useMutation } from "@tanstack/react-query";
import { apolloClient } from "../graphql/apolloClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CreateAQuestionDocument, CreateAQuestionMutationVariables, CreateAQuizDocument, CreateAQuizMutationVariables, SubmitQuizDocument, SubmitQuizMutationVariables } from "../generated/graphql";
import { useState } from "react";
export default function useQuizzesRUD() {
  const [courseId,setCourseId] = useState<string>()
  const queryClient = useQueryClient();
  const { mutateAsync: addNewQuiz } = useMutation({
    mutationFn: async (input: CreateAQuizMutationVariables) => {
      const { data } = await apolloClient.mutate({
        mutation: CreateAQuizDocument,
        variables: input,
        fetchPolicy: "network-only",
      });
      if (!data) {
        throw new Error("No response from server");
      }
      return data.createAQuiz;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course", courseId],
        
      });
      setCourseId(variables.input?.courseId);
    },
    onError: () => {
      toast.error("Creating a quiz failed");
    },
  });
  const { mutateAsync: createAQuestion} = useMutation({
    mutationFn: async (input: CreateAQuestionMutationVariables) => {
      const { data } = await apolloClient.mutate({
        mutation: CreateAQuestionDocument,
        variables: input,
        fetchPolicy: "network-only",
      });
      return data?.createAQuestion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course",courseId],
      });
    },
    onError: () => {
      toast.error("Adding question failed");
    },
  });
  const { mutateAsync: submitQuizAnswers } = useMutation({
    mutationFn: async (input: SubmitQuizMutationVariables) => {
      const { data } = await apolloClient.mutate({
        mutation: SubmitQuizDocument,
        variables: input,
        fetchPolicy: "network-only",
      });
      return data?.submitQuiz;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["course", data?.courseDetail?.courseId],
      });
    },
    onError: () => {
      toast.error("Submitting Quiz failed");
    },
  });

  return {createAQuestion,addNewQuiz,submitQuizAnswers};
}
