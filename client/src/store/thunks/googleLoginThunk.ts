import { createAsyncThunk } from '@reduxjs/toolkit';
import { apolloClient } from '../../graphql/apolloClient';
import {
  GoogleLoginDocument,
  GoogleLoginMutationVariables,
} from '../../generated/graphql';

export const googleLoginThunk = createAsyncThunk(
  'auth/google/login',
  async (input: GoogleLoginMutationVariables, { rejectWithValue }) => {
    try {
      const result = await apolloClient.mutate({
        mutation: GoogleLoginDocument,
        variables: input,
      });
      if (!result.data?.googleLogin) {
        throw new Error('Login failed');
      }
      return result.data.googleLogin;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue({ message: err.message });
      }

      return rejectWithValue({ message: 'Login failed' });
    }
  }
);
