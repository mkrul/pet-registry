import snakecaseKeys from "snakecase-keys";
import { transformToSnakeCase } from "../../../lib/apiHelpers";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import IReport from "../../../types/reports/IReport";
import IReportForm from "../../../types/reports/IReportForm";
import IPagination from "../../../types/shared/IPagination";

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
    getReports: build.query({
      query: () => "reports",
      transformResponse: (response: { reports: IReport[]; meta: IPagination }) => {
        return { data: response.reports, pagination: response.meta };
      },
      providesTags: ["Reports"]
    }),
    submitReport: build.mutation<void, { data: IReportForm }>({
      query: (report) => {
        const snakeCasedReport = transformToSnakeCase(report);
        console.log("Snake Cased Report Data:", snakeCasedReport);
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

export const { useGetReportsQuery, useSubmitReportMutation, useGetNewReportQuery } = reportsApi;
export default reportsApi;
