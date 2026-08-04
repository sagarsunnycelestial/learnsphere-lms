import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LoginInputs } from "../../types/types";
import { LOGIN_MUTATION } from "../../graphql/mutations/LOGIN_MUTATION";
import { apolloClient } from "../../graphql/apolloClient";

export const loginThunk = createAsyncThunk('auth/login',async(credentials:LoginInputs,{rejectWithValue})=> {
 try {
      const result = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: { input: credentials },
      });
      if (!result.data?.login) {
  throw new Error("Login failed");
}

      return result.data.login;
    } catch (err) {
  if (err instanceof Error) {
    return rejectWithValue({ message: err.message });
  }

  return rejectWithValue({ message: "Login failed" });
}
})