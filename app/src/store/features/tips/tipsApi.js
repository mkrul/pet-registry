import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tipsApi = createApi({
  reducerPath: "tipsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    credentials: "same-origin"
  }),
  tagTypes: ["Tips"],
  endpoints: (builder) => ({
    getTips: builder.query({
      query: (reportId) => `reports/${reportId}/events/index_tips`,
      providesTags: (result, error, reportId) => [
        { type: "Tips", id: `LIST-${reportId}` }
      ]
    }),
    createTip: builder.mutation({
      query: ({ reportId, ...tipData }) => ({
        url: `reports/${reportId}/events/create_tip`,
        method: "POST",
        body: tipData
      }),
      invalidatesTags: (result, error, { reportId }) => [
        { type: "Tips", id: `LIST-${reportId}` }
      ]
    })
  })
});

export const {
  useGetTipsQuery,
  useCreateTipMutation
} = tipsApi;
