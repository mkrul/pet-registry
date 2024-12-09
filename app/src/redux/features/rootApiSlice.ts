// rootApiSlice.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../lib/apiHelpers";

const rootApiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  endpoints: () => ({})
});

export default rootApiSlice;
