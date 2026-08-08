import { useMutation } from "@tanstack/react-query";
import { apolloClient } from "../graphql/apolloClient";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  AddALessonDocument,
  AddALessonMutationVariables,
  DeleteALessonDocument,
  DeleteALessonMutationVariables,
  EditALessonDocument,
  EditALessonMutationVariables,
} from "../generated/graphql";

export default function useLessonsCRUD() {
  const queryClient = useQueryClient();
  const { mutateAsync: addNewLesson } = useMutation({
    mutationFn: async (input: AddALessonMutationVariables) => {
      const { data } = await apolloClient.mutate({
        mutation: AddALessonDocument,
        variables: input,
        fetchPolicy: "network-only",
      });
      if (!data) {
        throw new Error("No response from server");
      }
      return data.addALesson.message;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course", variables.input?.courseId],
      });
    },
    onError: () => {
      toast.error("Adding a lesson failed");
    },
  });
  const { mutateAsync: updateLesson } = useMutation({
    mutationFn: async (input: EditALessonMutationVariables) => {
      const { data } = await apolloClient.mutate({
        mutation: EditALessonDocument,
        variables: input,
        fetchPolicy: "network-only",
      });
      return data?.editALesson;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course", variables.input?.courseId],
      });
    },
    onError: () => {
      toast.error("Editing lesson failed");
    },
  });
  const { mutateAsync: deleteLesson } = useMutation({
    mutationFn: async (input: DeleteALessonMutationVariables) => {
      const { data } = await apolloClient.mutate({
        mutation: DeleteALessonDocument,
        variables: input,
        fetchPolicy: "network-only",
      });
      return data?.deleteALesson;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course", variables.input.courseId],
      });
    },
    onError: () => {
      toast.error("Deleting lesson failed");
    },
  });

  return { addNewLesson, updateLesson, deleteLesson };
}
