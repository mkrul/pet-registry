import { transformToCamelCase } from "../../../shared/apiHelpers.js";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getStateOptions } from "../../../shared/reports/stateList.js";
import { eventsApi } from "../events/eventsApi.js";
import petsApi from "../pets/petsApi.js";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    credentials: "same-origin"
  }),
  tagTypes: ["Reports", "Pets", "Events"],
  endpoints: build => ({
    getReport: build.query({
      query: id => `reports/${id}`,
      transformResponse: (response) => transformToCamelCase(response),
      providesTags: (result, error, id) => [{ type: "Reports", id: id }]
    }),
    getStates: build.query({
      queryFn: () => {
        const states = getStateOptions();
        return { data: states };
      }
    }),
    getCities: build.query({
      query: ({ country, state }) => ({
        url: `filters/cities`,
        params: { country, state }
      }),
      transformResponse: (response) => response.cities
    }),
    getReports: build.query({
      query: params => {
        const queryParams = {
          page: params.page?.toString() || "1"
        };

        if (params.items) {
          queryParams.per_page = params.items.toString();
        }

        if (params.query) {
          queryParams.query = params.query;
        }
        if (params.species) {
          queryParams.species = params.species;
        }
        if (params.color) {
          queryParams.color = params.color;
        }
        if (params.gender) {
          queryParams.gender = params.gender;
        }
        if (params.country) {
          queryParams.country = params.country;
        }
        if (params.state) {
          queryParams.state = params.state;
        }
        if (params.area) {
          queryParams.area = params.area;
        }
        if (params.sort) {
          queryParams.sort = params.sort;
        }

        const queryString = new URLSearchParams(queryParams).toString();

        return {
          url: `reports?${queryString}`,
          method: "GET",
          meta: {
            cacheKey: JSON.stringify(params)
          }
        };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const serialized = JSON.stringify(queryArgs);
        return serialized;
      },
      transformResponse: (response) => {
        const reports = response.data.map(report => transformToCamelCase(report));
        const pagination = transformToCamelCase(response.pagination);
        return { data: reports, pagination, message: response.message };
      },
      keepUnusedDataFor: 30,
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Reports" , id })),
              { type: "Reports", id: "LIST" }
            ]
          : [{ type: "Reports", id: "LIST" }]
    }),
    updateReport: build.mutation({
      query: ({ id, data }) => ({
        url: `reports/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Reports", id },
        { type: "Reports", id: "LIST" },
        { type: "Reports", id: "USER_LIST" },
        { type: "Pets", id: "LIST" },
        { type: "Pets", id: "USER_LIST" },
        { type: "Events", id: "LIST" }
      ]
    }),
    archiveReport: build.mutation({
      query: (id) => ({
        url: `reports/${id}/archive`,
        method: "PATCH"
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            eventsApi.util.invalidateTags([{ type: "Events", id: "LIST" }])
          );
          dispatch(
            petsApi.util.invalidateTags([{ type: "Pets", id: "LIST" }, { type: "Pets", id: "USER_LIST" }])
          );
        } catch {}
      },
      invalidatesTags: (result, error, id) => [
        { type: "Reports", id },
        { type: "Reports", id: "LIST" },
        { type: "Reports", id: "USER_LIST" },
        { type: "Pets", id: "LIST" },
        { type: "Pets", id: "USER_LIST" }
      ]
    }),
    deleteReport: build.mutation({
      query: (id) => ({
        url: `reports/${id}`,
        method: "DELETE"
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            eventsApi.util.invalidateTags([{ type: "Events", id: "LIST" }])
          );
        } catch {}
      },
      invalidatesTags: (result, error, id) => [
        { type: "Reports", id },
        { type: "Reports", id: "LIST" },
        { type: "Reports", id: "USER_LIST" },
        { type: "Pets", id: "LIST" },
        { type: "Pets", id: "USER_LIST" }
      ]
    }),
    submitReport: build.mutation({
      query: formData => ({
        url: "reports",
        method: "POST",
        body: formData
      }),
      transformResponse: (
        response
      ) => {
        const transformedReport = transformToCamelCase(response);
        return {
          ...transformedReport,
          message: response.message,
          report: transformedReport,
          id: response.id,
          data: transformedReport
        };
      },
      invalidatesTags: (result, error, arg) => {
        const tags = [
          { type: "Reports", id: "LIST" },
          { type: "Reports", id: "USER_LIST" },
          { type: "Pets", id: "LIST" },
          { type: "Pets", id: "USER_LIST" },
          { type: "Events", id: "LIST" }
        ];

        // If petId was provided in the form data, also invalidate that specific pet
        const petId = arg.get("pet_id");
        if (petId) {
          tags.push({ type: "Pets", id: petId });
        }

        return tags;
      }
    }),
    getNewReport: build.query({
      query: () => "reports/new",
      providesTags: ["Reports"]
    }),
    getBreeds: build.query({
      query: (species) => ({
        url: `filters/breeds`,
        params: { species }
      }),
      transformResponse: (response) => response.breeds
    }),
    getUserReports: build.query({
      query: params => {
        const queryParams = {
          page: params.page?.toString() || "1"
        };

        if (params.items) {
          queryParams.per_page = params.items.toString();
        }

        if (params.status) {
          queryParams.status = params.status;
        }

        const queryString = new URLSearchParams(queryParams).toString();

        return {
          url: `users/reports?${queryString}`,
          method: "GET"
        };
      },
      transformResponse: (response) => {
        const reports = response.data.map(report => transformToCamelCase(report));
        const pagination = transformToCamelCase(response.pagination);
        return { data: reports, pagination, message: response.message };
      },
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Reports" , id })),
              { type: "Reports", id: "USER_LIST" }
            ]
          : [{ type: "Reports", id: "USER_LIST" }]
    })
  })
});

export const {
  useGetReportQuery,
  useGetReportsQuery,
  useGetStatesQuery,
  useGetCitiesQuery,
  useGetBreedsQuery,
  useSubmitReportMutation,
  useGetNewReportQuery,
  useUpdateReportMutation,
  useArchiveReportMutation,
  useDeleteReportMutation,
  useGetUserReportsQuery
} = reportsApi;
export default reportsApi;
