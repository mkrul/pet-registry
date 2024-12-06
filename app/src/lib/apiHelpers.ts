import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IPaginationResponse } from "../types/shared/Pagination";

export const baseQuery = fetchBaseQuery({
  baseUrl: `http://${window.location.hostname}:3000/api`,
  credentials: "include"
});

export const transformToCamelCase = <T>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map(v => transformToCamelCase<T>(v)) as unknown as T;
  } else if (obj !== null && obj !== undefined && typeof obj === "object") {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
      return {
        ...result,
        [camelKey]: transformToCamelCase(obj[key])
      };
    }, {}) as T;
  }
  return obj;
};

export const transformToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(v => transformToSnakeCase(v));
  } else if (obj !== null && obj !== undefined && typeof obj === "object") {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      return {
        ...result,
        [snakeKey]: transformToSnakeCase(obj[key])
      };
    }, {});
  }
  return obj;
};
