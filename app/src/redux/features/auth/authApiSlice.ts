import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { IUser } from "../../../types/User";
import { setUser, clearUser } from "./authSlice";

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
    login: builder.mutation<{ user: IUser }, { user: { email: string; password: string } }>({
      query: credentials => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        credentials: "include"
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch (err) {
          // Handle error if needed
        }
      }
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "DELETE"
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearUser());
        } catch (err) {
          // Handle error if needed
        }
      }
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

export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery, useSignUpMutation } =
  authApiSlice;
