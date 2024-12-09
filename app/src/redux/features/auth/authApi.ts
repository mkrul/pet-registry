import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginRequest {
  user: {
    email: string;
    password: string;
    remember_me?: string;
  };
}

interface SignUpRequest {
  user: {
    email: string;
    password: string;
    password_confirmation: string;
  };
}

interface AuthResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    id: number;
    email: string;
    created_at: string;
  };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include"
  }),
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: credentials => ({
        url: "login",
        method: "POST",
        body: credentials
      })
    }),
    signup: builder.mutation<AuthResponse, SignUpRequest>({
      query: credentials => ({
        url: "signup",
        method: "POST",
        body: credentials
      })
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "logout",
        method: "DELETE"
      })
    })
  })
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation } = authApi;
