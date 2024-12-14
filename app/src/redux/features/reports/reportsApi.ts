import { transformToSnakeCase, transformToCamelCase } from "../../../lib/apiHelpers";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IReport } from "../../../types/Report";
import { IImage } from "../../../types/shared/Image";
import { IReportForm } from "../../../types/Report";
import { IPagination, IPaginationQuery } from "../../../types/shared/Pagination";

export const reportsApi = createApi({
  reducerPath: "reportsApi",
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
      query: id => `reports/${id}`,
      transformResponse: (response: IReport) => transformToCamelCase(response),
      providesTags: (result, error, id) => [{ type: "Reports", id: id }]
    }),
    getReports: build.query<
      {
        data: IReport[];
        pagination: IPagination;
      },
      IPaginationQuery
    >({
      query: ({ page, items, query, species, color, gender, sort, country }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: items.toString()
        });

        if (query) params.append("query", query);
        if (species) params.append("species", species);
        if (color) params.append("color", color);
        if (gender) params.append("gender", gender);
        if (sort) params.append("sort", sort);
        if (country) params.append("country", country);

        return `reports?${params.toString()}`;
      },
      transformResponse: (response: { data: IReport[]; pagination: IPagination }) => {
        const reports = response.data.map(report => transformToCamelCase(report));
        const pagination = transformToCamelCase(response.pagination);
        return { data: reports, pagination };
      },
      providesTags: ["Reports"]
    }),
    updateReport: build.mutation<IReport, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `reports/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Reports", id }, "Reports"]
    }),
    submitReport: build.mutation<void, FormData>({
      query: formData => ({
        url: "reports",
        method: "POST",
        body: formData
        // Do not set 'Content-Type'; let the browser handle it
      }),
      invalidatesTags: ["Reports"]
    }),
    getNewReport: build.query<IReport, void>({
      query: () => "reports/new",
      providesTags: ["Reports"]
    })
  })
});

export const {
  useGetReportQuery,
  useGetReportsQuery,
  useSubmitReportMutation,
  useGetNewReportQuery,
  useUpdateReportMutation
} = reportsApi;
export default reportsApi;
