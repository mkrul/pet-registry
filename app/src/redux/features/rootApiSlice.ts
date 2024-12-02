// rootApiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { qsSettings } from '../../lib/apiHelpers';

export const rootApiSlice = createApi({
  reducerPath: 'rootApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `http://${window.location.hostname}:3000/api`,
    credentials: 'include',
    paramsSerializer: (params) => qs.stringify(params, qsSettings as any),
  }),
  endpoints: () => ({}),
  tagTypes: ['Reports'],
});

export default rootApiSlice;
