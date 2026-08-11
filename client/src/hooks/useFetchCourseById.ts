import { useQuery } from '@tanstack/react-query';
import { FetchCourseByIdDocument } from '../generated/graphql';
import { apolloClient } from '../graphql/apolloClient';

export default function useFetchCourseById(courseId: string) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: FetchCourseByIdDocument,
        variables: { courseId },
        fetchPolicy: 'network-only',
      });
      return data?.fetchCourseById;
    },
  });
}
