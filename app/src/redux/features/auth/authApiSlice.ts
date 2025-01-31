import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, clearUser, setLoading, setError } from "./authSlice";
import { setNotification } from "../notifications/notificationsSlice";
import { NotificationType } from "../../../types/common/Notification";
import { AuthResponse, SignUpRequest } from "../../../types/auth/AuthApiSlice";

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
    prepareHeaders: headers => {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
      if (token) {
        headers.set("X-CSRF-Token", token);
      }
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
          dispatch(
            setNotification({
              type: NotificationType.SUCCESS,
              message: data.message || "Logged in successfully"
            })
          );
        } catch (err: any) {
          console.log("Login error:", {
            error: err,
            errorData: err?.error?.data,
            errorMessage: err?.error?.data?.error
          });
          const errorMessage = err?.error?.data?.error || err?.data?.error || "Login failed";
          dispatch(setError(errorMessage));
          dispatch(clearUser());
          dispatch(
            setNotification({
              type: NotificationType.ERROR,
              message: errorMessage
            })
          );
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "DELETE",
        credentials: "include"
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.clear();
          sessionStorage.clear();
          dispatch(clearUser());
          dispatch(authApiSlice.util.resetApiState());
          window.location.href = "/login";
        } catch (err: any) {
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
