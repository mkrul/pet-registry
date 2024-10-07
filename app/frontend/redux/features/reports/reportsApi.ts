import { transformToSnakeCase, transformToCamelCase } from "../../../lib/apiHelpers";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IReport } from "../../../types/reports/Report";
import { IReportForm } from "../../../types/reports/Report";
import { IPagination } from "../../../types/shared/Pagination";
import { IPaginationQuery } from "../../../types/shared/Pagination";

const reportsApi = createApi({
  reducerPath: "reportsApi", // Ensure this is different from rootApi
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${window.location.hostname}:3000/api`,
    credentials: "include",
    paramsSerializer: params => {
      return new URLSearchParams(params as Record<string, string>).toString();
    }
  }),
  tagTypes: ["Reports"],
  endpoints: build => ({
    getReport: build.query<IReport, number>({
      query: (id) => `reports/${id}`,
      transformResponse: (response: IReport) => transformToCamelCase(response),
      providesTags: (result, error, id) => [{ type: "Reports", id: id }]
    }),
    getReports: build.query({
      query: ({ page, items, query }: IPaginationQuery) => `reports?page=${page}&per_page=${items}&query=${query}`,
      transformResponse: (response: { data: IReport[]; pagination: IPagination }) => {
        const reports = response.data.map((report) => transformToCamelCase(report));
        const pagination = transformToCamelCase(response.pagination);
        return { data: reports, pagination };
      },
      providesTags: ["Reports"]
    }),
    updateReport: build.mutation<IReport, { id: number; data: IReportForm }>({
      query: ({ id, data }) => {
        const snakeCasedData = transformToSnakeCase(data);
        return {
          url: `reports/${id}`,
          method: "PUT",
          body: snakeCasedData
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Reports", id }]
    }),
    submitReport: build.mutation<void, { data: IReportForm }>({
      query: (report) => {
        const snakeCasedReport = transformToSnakeCase(report);
        return {
          url: "reports",
          method: "POST",
          body: snakeCasedReport,
        };
      },
      invalidatesTags: ["Reports"],
    }),
    getNewReport: build.query<IReport, void>({
      query: () => "reports/new",
      providesTags: ["Reports"]
    })
  })
});

export const { useGetReportQuery, useGetReportsQuery, useSubmitReportMutation, useGetNewReportQuery, useUpdateReportMutation } = reportsApi;
export default reportsApi;
