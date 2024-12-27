import { transformToSnakeCase, transformToCamelCase } from "../../../lib/apiHelpers";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IReport } from "../../../types/Report";
import { IImage } from "../../../types/shared/Image";
import { IReportForm } from "../../../types/Report";
import { IPagination } from "../../../types/shared/Pagination";
import { Errors } from "../../../types/ErrorMessages";

interface UpdateReportResponse {
  message: string;
  report: IReport;
}

export interface IPaginationQuery {
  page: number;
  items: number;
  query?: string;
  species?: string;
  color?: string;
  gender?: string;
  sort?: string;
  country?: string;
  state?: string;
  area?: string;
  breed?: string;
}

interface ErrorResponse {
  data: {
    message: string;
  };
  status: number;
}

interface SubmitResponse {
  message: string;
  report: IReport;
  id: number;
}

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    credentials: "same-origin"
  }),
  tagTypes: ["Reports"],
  endpoints: build => ({
    getReport: build.query<IReport, number>({
      query: id => `reports/${id}`,
      transformResponse: (response: IReport) => transformToCamelCase(response),
      providesTags: (result, error, id) => [{ type: "Reports", id: id }],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message || Errors.REPORT_LOAD_FAILED
        }
      })
    }),
    getStates: build.query<string[], string>({
      query: (country: string) => ({
        url: `filters/states`,
        params: { country }
      }),
      transformResponse: (response: { states: string[] }) => response.states,
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message || Errors.STATES_FETCH_FAILED
        }
      })
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
          message: response.data?.message || Errors.CITIES_FETCH_FAILED
        }
      })
    }),
    getReports: build.query<
      {
        data: IReport[];
        pagination: IPagination;
      },
      IPaginationQuery
    >({
      query: params => {
        console.log("=== getReports Query Start ===");
        console.log("Raw input params:", params);
        const queryParams: Record<string, string> = {
          page: params.page?.toString() || "1",
          per_page: params.items?.toString() || "20"
        };
        console.log("Base query params:", queryParams);

        if (params.breed) {
          queryParams.breed = params.breed;
          console.log("Added breed filter:", params.breed);
        }

        if (params.query) {
          queryParams.query = params.query;
          console.log("Added query filter:", params.query);
        }
        if (params.species) {
          queryParams.species = params.species;
          console.log("Added species filter:", params.species);
        }
        if (params.color) {
          queryParams.color = params.color;
          console.log("Added color filter:", params.color);
        }
        if (params.gender) {
          queryParams.gender = params.gender;
          console.log("Added gender filter:", params.gender);
        }
        if (params.country) {
          queryParams.country = params.country;
          console.log("Added country filter:", params.country);
        }
        if (params.state) {
          queryParams.state = params.state;
          console.log("Added state filter:", params.state);
        }
        if (params.area) {
          queryParams.area = params.area;
          console.log("Added area filter:", params.area);
        }
        if (params.sort) {
          queryParams.sort = params.sort;
          console.log("Added sort parameter:", params.sort);
        }

        const queryString = new URLSearchParams(queryParams).toString();
        console.log("Final query params object:", queryParams);
        console.log("Final query string:", queryString);
        console.log("=== getReports Query End ===");

        return {
          url: `reports?${queryString}`,
          method: "GET",
          meta: {
            cacheKey: JSON.stringify(params)
          }
        };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        console.log("=== Serializing Query Args ===");
        console.log("Input query args:", queryArgs);
        const serialized = JSON.stringify(queryArgs);
        console.log("Serialized query args:", serialized);
        return serialized;
      },
      transformResponse: (response: { data: IReport[]; pagination: IPagination }) => {
        console.log("=== Transform Response Start ===");
        console.log("Raw API response:", response);
        const reports = response.data.map(report => transformToCamelCase(report));
        const pagination = transformToCamelCase(response.pagination);
        const transformed = { data: reports, pagination };
        console.log("Transformed response:", transformed);
        console.log("=== Transform Response End ===");
        return transformed;
      },
      keepUnusedDataFor: 30,
      providesTags: ["Reports"],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message || Errors.REPORTS_FETCH_FAILED
        }
      })
    }),
    updateReport: build.mutation<UpdateReportResponse, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `reports/${id}`,
        method: "PUT",
        body: data
      }),
      transformResponse: (response: { message: string; report: IReport }) => ({
        message: response.message,
        report: transformToCamelCase(response.report)
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Reports", id }, "Reports"],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message || Errors.REPORT_UPDATE_FAILED
        }
      })
    }),
    submitReport: build.mutation<SubmitResponse, FormData>({
      query: formData => ({
        url: "reports",
        method: "POST",
        body: formData
      }),
      transformResponse: (response: { message: string; id: number } & IReport) => ({
        message: response.message,
        report: transformToCamelCase(response),
        id: response.id
      }),
      invalidatesTags: ["Reports"],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message || Errors.REPORT_SUBMISSION_FAILED
        }
      })
    }),
    getNewReport: build.query<IReport, void>({
      query: () => "reports/new",
      providesTags: ["Reports"],
      transformErrorResponse: (response: { status: number; data: any }) => ({
        status: response.status,
        data: {
          message: response.data?.message || Errors.NEW_REPORT_LOAD_FAILED
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
          message: response.data?.message || Errors.BREEDS_FETCH_FAILED
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
