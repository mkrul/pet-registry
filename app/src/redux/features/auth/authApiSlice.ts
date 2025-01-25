import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, clearUser } from "./authSlice";
import { AuthResponse, SignUpRequest } from "../../../types/auth/AuthApiSlice";

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
        url: "/login",
        method: "POST",
        body: credentials
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch (err) {
          dispatch(clearUser());
        }
      },
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message
        }
      })
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/logout",
        method: "DELETE"
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearUser());
        } catch (err) {
          dispatch(clearUser());
        }
      },
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message
        }
      })
    }),
    getCurrentUser: builder.query<AuthResponse, void>({
      query: () => ({
        url: "/current_user",
        method: "GET"
      }),
      keepUnusedDataFor: 3600,
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(setUser(data.user));
          } else {
            dispatch(clearUser());
          }
        } catch (err) {
          dispatch(clearUser());
        }
      },
      providesTags: ["Auth"],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message
        }
      })
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
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch (err) {
          dispatch(clearUser());
        }
      },
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message
        }
      })
    })
  })
});

export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery, useSignUpMutation } =
  authApiSlice;
