import store from "../store/store";
import {ApolloClient,HttpLink,InMemoryCache} from '@apollo/client'
import {SetContextLink} from '@apollo/client/link/context'
const serverURL = import.meta.env.VITE_SERVER_URL;

const httpLink = new HttpLink({
  uri:serverURL,
  credentials:'include',
})

const authLink = new SetContextLink((prevContext)=> {
  const token = store.getState().auth.user.accessToken
  return {
    headers: {
      ...prevContext.headers,
      authorization:token ? `Bearer ${token}` : "",
    },
  };
})

export const apolloClient = new ApolloClient({
  link:authLink.concat(httpLink),
  cache:new InMemoryCache(),
})