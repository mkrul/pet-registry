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
  };
  token: string;
}

interface User {
  id: number;
  email: string;
  name: string;
  image: string;
}

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    credentials: 'include', // Include cookies
  }),
  endpoints: (builder) => ({
    googleLogin: builder.mutation<{ message: string; user: User }, { token: string }>({
      query: ({ token }) => ({
        url: '/auth/google_oauth2',
        method: 'POST',
        body: { token },
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGoogleLoginMutation, useLogoutMutation } = authApiSlice;
