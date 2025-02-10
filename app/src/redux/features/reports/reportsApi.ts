import { transformToCamelCase } from "../../../lib/apiHelpers";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ReportProps } from "../../../types/Report";
import {
  UpdateReportResponse,
  SubmitResponse,
  ReportsResponse
} from "../../../types/redux/features/reports/ReportsApi";
import { getStateOptions } from "../../../lib/reports/stateList";
import { PaginationPropsQuery } from "../../../types/common/Pagination";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    credentials: "same-origin"
  }),
  tagTypes: ["Reports"],
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
          per_page: params.items?.toString() || "20"
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
    submitReport: build.mutation<SubmitResponse, FormData>({
      query: formData => ({
        url: "reports",
        method: "POST",
        body: formData
      }),
      transformResponse: (
        response: { message: string; id: number } & ReportProps
      ): SubmitResponse => ({
        message: response.message,
        report: transformToCamelCase(response),
        id: response.id,
        data: transformToCamelCase(response)
      }),
      invalidatesTags: ["Reports"]
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
  useUpdateReportMutation
} = reportsApi;
export default reportsApi;
