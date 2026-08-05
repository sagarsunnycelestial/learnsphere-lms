import { useMutation } from "@tanstack/react-query";
import { apolloClient } from "../graphql/apolloClient";
import { ADD_USER_MUTATION } from "../graphql/mutations/ADD_USER_MUTATION";
import type { RegisterMutationInput } from "../types/types";
import { useQueryClient } from "@tanstack/react-query";

export default function useUserCRUD() {
  const queryClient = useQueryClient();
  const { mutateAsync: addNewUser } = useMutation({
    mutationFn: async (input: RegisterMutationInput) => {
      const { data } = await apolloClient.mutate({
        mutation: ADD_USER_MUTATION,
        variables: input,
        fetchPolicy: "network-only",
      });
      if (!data) {
        throw new Error("No response from server");
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users-list"],
      });
    },
  });

  return { addNewUser };
}
