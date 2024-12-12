import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { IUser } from "../../../types/User";
import { setUser, clearUser } from "./authSlice";

interface AuthResponse {
  message: string;
  user: IUser;
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
  tagTypes: ["Auth"],
  keepUnusedDataFor: 3600,
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, { user: { email: string; password: string } }>({
      query: credentials => ({
        url: "/auth/login",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          console.log("Login attempt started");
          const { data } = await queryFulfilled;
          console.log("Login successful:", data);
          dispatch(setUser(data.user));
        } catch (err) {
          console.error("Login error:", err);
        }
      }
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "DELETE"
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          console.log("Logout attempt started");
          await queryFulfilled;
          console.log("Logout successful");
          dispatch(clearUser());
        } catch (err) {
          console.error("Logout error:", err);
        }
      }
    }),
    getCurrentUser: builder.query<AuthResponse, void>({
      query: () => ({
        url: "auth/current_user",
        method: "GET"
      }),
      keepUnusedDataFor: 3600,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          console.log("Checking current user");
          const { data } = await queryFulfilled;
          console.log("Current user check successful:", data);
          if (data?.user) {
            dispatch(setUser(data.user));
          } else {
            console.log("No user data in response");
            dispatch(clearUser());
          }
        } catch (err) {
          console.error("Current user check failed:", err);
          dispatch(clearUser());
        }
      },
      providesTags: ["Auth"]
    }),
    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      query: credentials => ({
        url: "/auth/registration",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          console.log("Sign up attempt started");
          const { data } = await queryFulfilled;
          console.log("Sign up successful:", data);
          dispatch(setUser(data.user));
        } catch (err) {
          console.error("Sign up error:", err);
        }
      }
    })
  })
});

export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery, useSignUpMutation } =
  authApiSlice;
