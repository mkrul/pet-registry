import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { IUser } from "../../../types/User";

interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    name: string;
    image: string;
  };
  token: string;
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
    googleLogin: builder.mutation<{ user: IUser; message: string }, { token: string }>({
      query: ({ token }) => ({
        url: "/auth/google_oauth2",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: { token }
      })
    }),
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
    })
  })
});

export const { useGoogleLoginMutation, useLogoutMutation, useGetCurrentUserQuery } = authApiSlice;
