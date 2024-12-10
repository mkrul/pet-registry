import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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
      console.debug("============ Preparing Request Headers ============");
      console.debug("Current headers:", Object.fromEntries(headers.entries()));
      headers.set("Content-Type", "application/json");
      return headers;
    }
  }),
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, { user: { email: string; password: string } }>({
      query: credentials => {
        console.debug("============ Login Request Started ============");
        console.debug("Login credentials:", {
          ...credentials,
          user: { ...credentials.user, password: "[REDACTED]" }
        });
        return {
          url: "/auth/login",
          method: "POST",
          body: credentials,
          credentials: "include"
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          console.debug("Awaiting login response...");
          const { data } = await queryFulfilled;
          console.debug("Login successful, user data:", data);
          dispatch(setUser(data.user));
        } catch (err) {
          console.error("Login failed:", err);
        }
      }
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => {
        console.debug("============ Logout Request Started ============");
        return {
          url: "/auth/logout",
          method: "DELETE",
          credentials: "include"
        };
      },
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          console.debug("Awaiting logout response...");
          await queryFulfilled;
          console.debug("Logout successful");
          dispatch(clearUser());
        } catch (err) {
          console.error("Logout failed:", err);
        }
      }
    }),
    getCurrentUser: builder.query<{ user: IUser | null }, void>({
      query: () => {
        console.debug("============ Checking Current User ============");
        return {
          url: "/auth/authenticated_user",
          method: "GET",
          credentials: "include"
        };
      }
    }),
    signUp: builder.mutation<AuthResponse, SignUpRequest>({
      query: credentials => {
        console.debug("============ Signup Request Started ============");
        console.debug("Signup credentials:", {
          ...credentials,
          user: {
            ...credentials.user,
            password: "[REDACTED]",
            password_confirmation: "[REDACTED]"
          }
        });
        return {
          url: "/auth",
          method: "POST",
          body: credentials,
          credentials: "include"
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          console.debug("Awaiting signup response...");
          const { data } = await queryFulfilled;
          console.debug("Signup successful, user data:", data);
          dispatch(setUser(data.user));
        } catch (err) {
          console.error("Signup failed:", err);
          throw err;
        }
      }
    })
  })
});

export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery, useSignUpMutation } =
  authApiSlice;
