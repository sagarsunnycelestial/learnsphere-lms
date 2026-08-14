import { useQuery } from '@tanstack/react-query';
import { FetchStudentsDocument } from '../generated/graphql';
import { apolloClient } from '../graphql/apolloClient';

export default function useFetchStudents(courseId: string | null, enabled: boolean = false) {
  return useQuery({
    queryKey: ['student-profile', courseId],
    enabled: !!courseId && enabled,
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: FetchStudentsDocument,
        fetchPolicy: 'network-only',
        variables: { courseId: courseId || null },
      });
      return data?.fetchStudents;
    },
  });
}
