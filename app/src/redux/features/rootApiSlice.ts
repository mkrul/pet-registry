// rootApiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import qs from "qs";
import { qsSettings } from "../../lib/apiHelpers";
import { apiConfig } from "../../lib/apiConfig";

export const rootApiSlice = createApi({
  reducerPath: "rootApi",
  baseQuery: fetchBaseQuery({
    baseUrl: apiConfig.baseUrl,
    credentials: "include",
    paramsSerializer: params => qs.stringify(params, qsSettings as any)
  }),
  endpoints: () => ({}),
  tagTypes: ["Reports"]
});

export default rootApiSlice;
