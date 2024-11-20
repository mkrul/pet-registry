// src/redux/features/auth/authApiSlice.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../store';

interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    image: string;
    // Add other user fields as needed
  };
  token: string;
}

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    googleLogin: builder.mutation<AuthResponse, { token: string }>({
      query: ({ token }) => ({
        url: '/auth/google_oauth2',
        method: 'POST',
        body: { token },
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/logout',
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGoogleLoginMutation, useLogoutMutation } = authApiSlice;
