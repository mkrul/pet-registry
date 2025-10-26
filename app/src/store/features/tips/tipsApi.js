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
    getLastLocation: builder.query({
      query: (reportId) => `reports/${reportId}/events/last_location`,
      providesTags: (result, error, reportId) => [
        { type: "Tips", id: `LAST_LOCATION-${reportId}` }
      ]
    }),
    createTip: builder.mutation({
      query: ({ reportId, ...tipData }) => ({
        url: `reports/${reportId}/events/create_tip`,
        method: "POST",
        body: tipData
      }),
      invalidatesTags: (result, error, { reportId }) => [
        { type: "Tips", id: `LIST-${reportId}` },
        { type: "Tips", id: `LAST_LOCATION-${reportId}` }
      ]
    })
  })
});

export const {
  useGetTipsQuery,
  useGetLastLocationQuery,
  useCreateTipMutation
} = tipsApi;
