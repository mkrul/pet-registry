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

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${window.location.hostname}:3000/api`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    googleLogin: builder.mutation<AuthResponse, { tokenId: string }>({
      query: ({ tokenId }) => ({
        url: '/auth/google_oauth2/callback',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { tokenId },
      }),
      // Optionally transform the response
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
