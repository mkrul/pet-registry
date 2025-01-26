import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, clearUser, setLoading, setError } from "./authSlice";
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
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, { user: { email: string; password: string } }>({
      query: credentials => ({
        url: "/login",
        method: "POST",
        body: credentials,
        credentials: "include"
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch (err: any) {
          dispatch(setError(err?.data?.message || "Login failed"));
          dispatch(clearUser());
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "DELETE"
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.clear();
          sessionStorage.clear();
          dispatch(clearUser());
        } catch (err) {
          dispatch(setError("Logout failed"));
        }
      }
    }),
    getCurrentUser: builder.query<AuthResponse, void>({
      query: () => "/current_user",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(setUser(data.user));
          } else {
            dispatch(clearUser());
          }
        } catch (err) {
          dispatch(clearUser());
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      query: credentials => ({
        url: "/sign_up",
        method: "POST",
        body: credentials
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data.user));
        } catch (err: any) {
          dispatch(setError(err?.data?.message || "Sign up failed"));
          dispatch(clearUser());
        } finally {
          dispatch(setLoading(false));
        }
      }
    })
  })
});

export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery, useSignUpMutation } =
  authApiSlice;
