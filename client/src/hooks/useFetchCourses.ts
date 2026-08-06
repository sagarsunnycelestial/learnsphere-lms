import { useQuery } from "@tanstack/react-query"
import { FetchCoursesDocument } from "../generated/graphql"
import { apolloClient } from "../graphql/apolloClient"

export default function useFetchProfile() {
  return useQuery({
    queryKey:['courses'],
    queryFn: async()=>{
      const {data} = await apolloClient.query({
        query:FetchCoursesDocument,
        fetchPolicy:'network-only',
      })
      return data?.fetchCourses
    }
  })
  
}
