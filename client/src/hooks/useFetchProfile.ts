import { useQuery } from "@tanstack/react-query"
import { FetchProfileDocument } from "../generated/graphql"
import { apolloClient } from "../graphql/apolloClient"

export default function useFetchProfile() {
  return useQuery({
    queryKey:['user-profile'],
    queryFn: async()=>{
      const {data} = await apolloClient.query({
        query:FetchProfileDocument,
        fetchPolicy:'network-only',
      })
      return data?.fetchProfile
    }
  })
  
}
