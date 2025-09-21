import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import qs from "qs";
import { qsSettings } from "../../shared/apiHelpers";
import { apiConfig } from "../../shared/apiConfig";

export const rootApiSlice = createApi({
  reducerPath: "rootApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.baseUrl,
    credentials: "include",
    paramsSerializer: params => qs.stringify(params, qsSettings)
  }),
  endpoints: () => ({}),
  tagTypes: ["Reports"]
});

export default rootApiSlice;
