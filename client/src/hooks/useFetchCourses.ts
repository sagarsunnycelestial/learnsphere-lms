import { useQuery } from '@tanstack/react-query';
import { FetchCoursesDocument, FetchCoursesQueryVariables } from '../generated/graphql';
import { apolloClient } from '../graphql/apolloClient';

export default function useFetchCourses(filter: FetchCoursesQueryVariables) {
  return useQuery({
    queryKey: ['course', filter],
    queryFn: async () => {
      const { data } = await apolloClient.query({
        query: FetchCoursesDocument,
        fetchPolicy: 'network-only',
        variables: filter,
      });
      return data?.fetchCourses;
    },
  });
}
