import { transformToCamelCase } from "../../../lib/apiHelpers";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ReportProps } from "../../../types/Report";
import { PaginationProps } from "../../../types/common/Pagination";
import {
  UpdateReportResponse,
  PaginationPropsQuery,
  SubmitResponse
} from "../../../types/redux/features/reports/ReportsApi";
import { setNotification } from "../notifications/notificationsSlice";
import { NotificationType } from "../../../types/common/Notification";
import { getStateOptions } from "../../../lib/reports/stateList";

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
      providesTags: (result, error, id) => [{ type: "Reports", id: id }],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message
        }
      })
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
      transformResponse: (response: { cities: string[] }) => response.cities,
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message
        }
      })
    }),
    getReports: build.query<
      { data: ReportProps[]; pagination: PaginationProps },
      PaginationPropsQuery
    >({
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
      transformResponse: (response: { data: ReportProps[]; pagination: PaginationProps }) => {
        const reports = response.data.map(report => transformToCamelCase(report));
        const pagination = transformToCamelCase(response.pagination);
        const transformed = { data: reports, pagination };
        return transformed;
      },
      keepUnusedDataFor: 30,
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Reports" as const, id })),
              { type: "Reports", id: "LIST" }
            ]
          : [{ type: "Reports", id: "LIST" }],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message
        }
      })
    }),
    updateReport: build.mutation<UpdateReportResponse, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `reports/${id}`,
        method: "PUT",
        body: data
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setNotification({
              type: NotificationType.SUCCESS,
              message: data.message
            })
          );
        } catch (err: any) {
          dispatch(
            setNotification({
              type: NotificationType.ERROR,
              message: err.data?.message || "Failed to update report"
            })
          );
        }
      },
      transformResponse: (response: { message: string; report: ReportProps }) => ({
        message: response.message,
        report: transformToCamelCase(response.report)
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Reports", id },
        "Reports",
        { type: "Reports", id: "LIST" }
      ],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message
        }
      })
    }),
    submitReport: build.mutation<SubmitResponse, FormData>({
      query: formData => ({
        url: "reports",
        method: "POST",
        body: formData
      }),
      transformResponse: (response: { message: string; id: number } & ReportProps) => ({
        message: response.message,
        report: transformToCamelCase(response),
        id: response.id
      }),
      invalidatesTags: ["Reports"],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message
        }
      })
    }),
    getNewReport: build.query<ReportProps, void>({
      query: () => "reports/new",
      providesTags: ["Reports"],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message
        }
      })
    }),
    getBreeds: build.query<string[], string>({
      query: (species: string) => ({
        url: `filters/breeds`,
        params: { species }
      }),
      transformResponse: (response: { breeds: string[] }) => response.breeds,
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message
        }
      })
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
