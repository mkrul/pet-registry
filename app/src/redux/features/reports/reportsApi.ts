import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../../lib/apiHelpers";
import { IReport } from "../../../types/Report";
import { IImage } from "../../../types/shared/Image";
import { IReportForm } from "../../../types/Report";
import { IPaginationResponse, IPaginationQuery } from "../../../types/shared/Pagination";

const reportsApi = createApi({
  reducerPath: "reportsApi",
  baseQuery,
  tagTypes: ["Reports"],
  endpoints: builder => ({
    getNewReport: builder.query<IReport, void>({
      query: () => "reports/new"
    }),
    getReport: builder.query<IReport, number>({
      query: id => `reports/${id}`,
      providesTags: ["Reports"]
    }),
    getReports: builder.query<
      {
        data: IReport[];
        pagination: IPaginationResponse;
      },
      IPaginationQuery
    >({
      query: ({ page, query, species, gender, color, status, sort }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: "20"
        });

        if (query) params.append("query", query);
        if (species.length > 0) params.append("species", species.join(","));
        if (color.length > 0) params.append("color", color.join(","));
        if (gender.length > 0) params.append("gender", gender.join(","));
        if (status.length > 0) params.append("status", status.join(","));
        if (sort) params.append("sort", sort);

        return `reports?${params.toString()}`;
      },
      providesTags: ["Reports"]
    }),
    submitReport: builder.mutation<IReport, FormData>({
      query: data => ({
        url: "reports",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["Reports"]
    }),
    updateReport: builder.mutation<IReport, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `reports/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Reports"]
    }),
    deleteReport: builder.mutation<void, number>({
      query: id => ({
        url: `reports/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Reports"]
    })
  })
});

export const {
  useGetNewReportQuery,
  useGetReportQuery,
  useGetReportsQuery,
  useSubmitReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation
} = reportsApi;

export default reportsApi;
