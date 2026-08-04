import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginInputs } from "../../types/types";
import { LOGIN_MUTATION } from "../../graphql/mutations/LOGIN_MUTATION";
import { apolloClient } from "../../graphql/apolloClient";

export const loginThunk = createAsyncThunk('auth/login',async(credentials:LoginInputs,{dispatch,rejectWithValue})=> {

  const result = await apolloClient.mutate({
    mutation:LOGIN_MUTATION,
    variables:{input:credentials}
  })
return result.data.login
})