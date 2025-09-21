import { transformToCamelCase } from "../../../shared/apiHelpers";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ReportProps } from "../../../features/reports/types/Report";
import {
  UpdateReportResponse,
  SubmitResponse,
  ReportsResponse
} from "../../../shared/types/redux/features/reports/ReportsApi";
import { getStateOptions } from "../../../shared/reports/stateList";
import { PaginationPropsQuery } from "../../../shared/types/common/Pagination";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    credentials: "same-origin"
  }),
  tagTypes: ["Reports", "Pets"],
  endpoints: build => ({
    getReport: build.query<ReportProps, number>({
      query: id => `reports/${id}`,
      transformResponse: (response: ReportProps) => transformToCamelCase(response),
      providesTags: (result, error, id) => [{ type: "Reports", id: id }]
    }),
    getStates: build.query<string[], string>({
      queryFn: () => {
        const states = getStateOptions();
        return { data: states };
      }
    }),
    getCities: build.query<string[], { country: string; state: string }>({
      query: ({ country, state }) => ({
        url: `filters/cities`,
        params: { country, state }
      }),
      transformResponse: (response: { cities: string[] }) => response.cities
    }),
    getReports: build.query<ReportsResponse, PaginationPropsQuery>({
      query: params => {
        const queryParams: Record<string, string> = {
          page: params.page?.toString() || "1",
          per_page: params.items?.toString() || "21" // This will be overridden by useReportsData hook
        };

        if (params.breed) {
          queryParams.breed = params.breed;
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
      transformResponse: (response: ReportsResponse) => {
        const reports = response.data.map(report => transformToCamelCase(report));
        const pagination = transformToCamelCase(response.pagination);
        return { data: reports, pagination, message: response.message };
      },
      keepUnusedDataFor: 30,
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Reports" as const, id })),
              { type: "Reports", id: "LIST" }
            ]
          : [{ type: "Reports", id: "LIST" }]
    }),
    updateReport: build.mutation<UpdateReportResponse, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `reports/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Reports", id },
        { type: "Reports", id: "LIST" }
      ]
    }),
    archiveReport: build.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `reports/${id}/archive`,
        method: "PATCH"
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Reports", id },
        { type: "Reports", id: "LIST" },
        { type: "Reports", id: "USER_LIST" }
      ]
    }),
    deleteReport: build.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `reports/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Reports", id },
        { type: "Reports", id: "LIST" },
        { type: "Reports", id: "USER_LIST" },
        { type: "Pets", id: "LIST" },
        { type: "Pets", id: "USER_LIST" }
      ]
    }),
    submitReport: build.mutation<SubmitResponse, FormData>({
      query: formData => ({
        url: "reports",
        method: "POST",
        body: formData
      }),
      transformResponse: (
        response: { message: string; id: number } & ReportProps
      ): SubmitResponse => {
        const transformedReport = transformToCamelCase(response);
        return {
          ...transformedReport,
          message: response.message,
          report: transformedReport,
          id: response.id,
          data: transformedReport
        };
      },
      invalidatesTags: [
        { type: "Reports", id: "LIST" },
        { type: "Reports", id: "USER_LIST" },
        { type: "Pets", id: "LIST" },
        { type: "Pets", id: "USER_LIST" }
      ]
    }),
    getNewReport: build.query<ReportProps, void>({
      query: () => "reports/new",
      providesTags: ["Reports"]
    }),
    getBreeds: build.query<string[], string>({
      query: (species: string) => ({
        url: `filters/breeds`,
        params: { species }
      }),
      transformResponse: (response: { breeds: string[] }) => response.breeds
    }),
    getUserReports: build.query<ReportsResponse, PaginationPropsQuery & { status?: string }>({
      query: params => {
        const queryParams: Record<string, string> = {
          page: params.page?.toString() || "1",
          per_page: params.items?.toString() || "21"
        };

        if (params.status) {
          queryParams.status = params.status;
        }

        const queryString = new URLSearchParams(queryParams).toString();

        return {
          url: `users/reports?${queryString}`,
          method: "GET"
        };
      },
      transformResponse: (response: ReportsResponse) => {
        const reports = response.data.map(report => transformToCamelCase(report));
        const pagination = transformToCamelCase(response.pagination);
        return { data: reports, pagination, message: response.message };
      },
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Reports" as const, id })),
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
