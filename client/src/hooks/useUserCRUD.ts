import { useMutation } from '@tanstack/react-query';
import { apolloClient } from '../graphql/apolloClient';
import { ADD_USER_MUTATION } from '../graphql/mutations/AddUserMutation';
import type { RegisterMutationInput } from '../types/types';
import { useQueryClient } from '@tanstack/react-query';

import {
  UpdateProfileDocument,
  UpdateProfileMutationVariables,
  EnrollCourseDocument,
  EnrollCourseMutationVariables,
} from '../generated/graphql';
import { toast } from 'react-toastify';

export default function useUserCRUD() {
  const queryClient = useQueryClient();
  const { mutateAsync: addNewUser } = useMutation({
    mutationFn: async (input: RegisterMutationInput) => {
      const { data } = await apolloClient.mutate({
        mutation: ADD_USER_MUTATION,
        variables: input,
        fetchPolicy: 'network-only',
      });
      if (!data) {
        throw new Error('No response from server');
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users-list'],
      });
    },
  });
  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: async (input: UpdateProfileMutationVariables) => {
      const { data } = await apolloClient.mutate({
        mutation: UpdateProfileDocument,
        variables: input,
        fetchPolicy: 'network-only',
      });
      return data?.updateProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-profile'],
      });
    },
    onError: () => {
      toast.error('Update Failed');
    },
  });
  const { mutateAsync: enrollStudent } = useMutation({
    mutationFn: async (input: EnrollCourseMutationVariables) => {
      const { data } = await apolloClient.mutate({
        mutation: EnrollCourseDocument,
        variables: input,
        fetchPolicy: 'network-only',
      });
      return data?.enrollCourse;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['student-profile', variables.input?.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ['course'],
      });
      queryClient.invalidateQueries({
        queryKey: ['course', variables.input?.courseId],
      });
    },
    onError: () => {
      toast.error('Update Failed');
    },
  });
  return { addNewUser, updateProfile, enrollStudent };
}
