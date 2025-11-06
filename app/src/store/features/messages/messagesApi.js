import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
    prepareHeaders: headers => {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
      if (token) headers.set("X-CSRF-Token", token);
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      return headers;
    }
  }),
  tagTypes: ["Conversations", "Conversation", "UnreadCount"],
  endpoints: builder => ({
    getConversations: builder.query({
      query: (page = 1) => ({ url: `/conversations?page=${page}` }),
      providesTags: ["Conversations", "UnreadCount"],
      transformResponse: (response) => {
        if (Array.isArray(response)) {
          return { conversations: response, pagination: null };
        }
        return {
          conversations: response.data || [],
          pagination: response.pagination || null
        };
      }
    }),
    createConversation: builder.mutation({
      query: (payload) => ({ url: "/conversations", method: "POST", body: payload }),
      invalidatesTags: ["Conversations"]
    }),
    createConversationForReport: builder.mutation({
      query: (reportId) => ({ url: `/reports/${reportId}/start_conversation`, method: "POST" }),
      invalidatesTags: ["Conversations"]
    }),
    createConversationForReportWithMessage: builder.mutation({
      query: (payload) => ({
        url: `/reports/${payload.reportId}/start_conversation_with_message`,
        method: "POST",
        body: payload
      }),
      invalidatesTags: ["Conversations"]
    }),
    getConversation: builder.query({
      query: ({ id, page = 1 }) => ({ url: `/conversations/${id}?page=${page}` }),
      providesTags: (result, error, arg) => [{ type: "Conversation", id: arg.id }]
    }),
    sendMessage: builder.mutation({
      query: ({ conversationId, body }) => ({
        url: `/conversations/${conversationId}/messages`,
        method: "POST",
        body: { body }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Conversation", id: arg.conversationId },
        "Conversations",
        "UnreadCount"
      ]
    }),
    getUnreadCount: builder.query({
      query: () => ({ url: "/messages/unread_count" }),
      providesTags: ["UnreadCount"]
    })
  })
});

export const {
  useGetConversationsQuery,
  useCreateConversationMutation,
  useCreateConversationForReportMutation,
  useCreateConversationForReportWithMessageMutation,
  useGetConversationQuery,
  useSendMessageMutation,
  useGetUnreadCountQuery
} = messagesApi;


