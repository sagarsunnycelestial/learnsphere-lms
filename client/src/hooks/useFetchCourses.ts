import { useQuery } from '@tanstack/react-query';
import { FetchCoursesDocument } from '../generated/graphql';
import { apolloClient } from '../graphql/apolloClient';

export default function useFetchCourses() {
  return useQuery({
    queryKey: ['course'],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: FetchCoursesDocument,
        fetchPolicy: 'network-only',
      });
      return data?.fetchCourses;
    },
  });
}
