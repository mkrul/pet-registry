import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { IUser } from "../../../types/User";

interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
  };
  token: string;
}

interface SignUpRequest {
  user: {
    email: string;
    password: string;
    password_confirmation: string;
  };
}

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
    prepareHeaders: headers => {
      return headers;
    }
  }),
  endpoints: builder => ({
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "DELETE"
      })
    }),
    getCurrentUser: builder.query<{ user: IUser | null }, void>({
      query: () => ({
        url: "auth/authenticated_user",
        method: "GET"
      })
    }),
    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      query: credentials => ({
        url: "/auth/registration",
        method: "POST",
        body: credentials
      })
    })
  })
});

export const { useLogoutMutation, useGetCurrentUserQuery, useSignUpMutation } = authApiSlice;
