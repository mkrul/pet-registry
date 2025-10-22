import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser, clearUser, setLoading, setError, updateLastActivity } from "./authSlice";
import { addNotification } from "../notifications/notificationsSlice";

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
    login: builder.mutation({
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
            addNotification({
              type: "SUCCESS",
              message: data.message || "Logged in successfully"
            })
          );
        } catch (err) {
          const errorMessage = err?.error?.data?.error || err?.data?.error || "Login failed";
          dispatch(setError(errorMessage));
          dispatch(clearUser());
          dispatch(
            addNotification({
              type: "ERROR",
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
        } catch (err) {
          dispatch(setError("Logout failed"));
        }
      }
    }),
    getCurrentUser: builder.query({
      query: () => ({
        url: "/current_user",
        credentials: "include"
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true));
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(setUser(data.user));
          }
        } catch (err) {
          if (err?.status === 401) {
            dispatch(clearUser());
          }
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    signUp: builder.mutation({
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
        } catch (err) {
          dispatch(setError(err?.data?.message || "Sign up failed"));
          dispatch(clearUser());
        } finally {
          dispatch(setLoading(false));
        }
      }
    }),
    pollSession: builder.mutation({
      query: () => ({
        url: "/api/sessions/poll",
        method: "POST",
        credentials: "include"
      }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(updateLastActivity());
      }
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: "/profile",
        method: "PATCH",
        body: { user: userData },
        credentials: "include"
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(setUser(data.user));
          }
          dispatch(
            addNotification({
              type: "SUCCESS",
              message: data.message || "Profile updated successfully"
            })
          );
        } catch (err) {
          const errorMessage = err?.error?.data?.error || err?.error?.data?.message || "Update failed";
          dispatch(
            addNotification({
              type: "ERROR",
              message: errorMessage
            })
          );
          throw err;
        }
      }
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/change_password",
        method: "PATCH",
        body: { user: passwordData },
        credentials: "include"
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(setUser(data.user));
          }
          dispatch(
            addNotification({
              type: "SUCCESS",
              message: data.message || "Password changed successfully"
            })
          );
        } catch (err) {
          const errorMessage = err?.error?.data?.error || err?.error?.data?.message || "Password change failed";
          dispatch(
            addNotification({
              type: "ERROR",
              message: errorMessage
            })
          );
          throw err;
        }
      }
    })
  })
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useSignUpMutation,
  usePollSessionMutation,
  useUpdateUserMutation,
  useChangePasswordMutation
} = authApiSlice;
