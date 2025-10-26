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
      query: ({ reportId, page = 1, perPage = 5 }) =>
        `reports/${reportId}/events/index_tips?page=${page}&per_page=${perPage}`,
      providesTags: (result, error, { reportId }) => [
        { type: "Tips", id: `LIST-${reportId}` }
      ]
    }),
    getAllTips: builder.query({
      query: (reportId) => `reports/${reportId}/events/all_tips`,
      providesTags: (result, error, reportId) => [
        { type: "Tips", id: `ALL-${reportId}` }
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
        { type: "Tips", id: `ALL-${reportId}` },
        { type: "Tips", id: `LAST_LOCATION-${reportId}` }
      ]
    })
  })
});

export const {
  useGetTipsQuery,
  useGetAllTipsQuery,
  useGetLastLocationQuery,
  useCreateTipMutation
} = tipsApi;
