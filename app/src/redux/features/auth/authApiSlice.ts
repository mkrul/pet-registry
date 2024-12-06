import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { IUser } from "../../../types/User";
import { setUser, clearUser, setAuthLoading, setAuthError } from "./authSlice";

interface AuthResponse {
  message: string;
  user: IUser;
}

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

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
    prepareHeaders: headers => {
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      return headers;
    }
  }),
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: credentials => ({
        url: "/auth/login",
        method: "POST",
        body: credentials
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(setAuthLoading());
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch (err) {
          dispatch(setAuthError("Login failed. Please check your credentials."));
        }
      }
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "DELETE"
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setAuthLoading());
        try {
          await queryFulfilled;
          dispatch(clearUser());
        } catch (err) {
          dispatch(setAuthError("Logout failed. Please try again."));
        }
      }
    }),
    getCurrentUser: builder.query<{ user: IUser | null }, void>({
      query: () => ({
        url: "auth/authenticated_user",
        method: "GET"
      }),
      transformResponse: (response: { user: IUser | null }) => {
        return response;
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setAuthLoading());
        try {
          const { data } = await queryFulfilled;
          if (data.user) {
            dispatch(setUser(data.user));
          } else {
            dispatch(clearUser());
          }
        } catch (err) {
          dispatch(setAuthError("Failed to verify authentication status."));
        }
      }
    }),
    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      query: credentials => ({
        url: "/auth/registration",
        method: "POST",
        body: credentials
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setAuthLoading());
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch (err) {
          dispatch(setAuthError("Sign up failed. Please try again."));
        }
      }
    })
  })
});

export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery, useSignUpMutation } =
  authApiSlice;
