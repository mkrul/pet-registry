import { transformToCamelCase } from "../../../shared/apiHelpers.js";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    credentials: "same-origin"
  }),
  tagTypes: ["Events"],
  endpoints: build => ({
    getUserEvents: build.query({
      query: params => {
        const queryParams = {
          page: params.page?.toString() || "1"
        };

        const queryString = new URLSearchParams(queryParams).toString();

        return {
          url: `users/events?${queryString}`,
          method: "GET"
        };
      },
      transformResponse: (response) => {
        const events = response.events.map(event => transformToCamelCase(event));
        const pagination = transformToCamelCase(response.pagination);
        return { data: events, pagination };
      },
      keepUnusedDataFor: 30,
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Events", id })),
              { type: "Events", id: "LIST" }
            ]
          : [{ type: "Events", id: "LIST" }]
    })
  })
});

export const {
  useGetUserEventsQuery
} = eventsApi;
