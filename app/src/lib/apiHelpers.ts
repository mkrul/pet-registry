import LinkHeader from "http-link-header";
import { PaginationProps } from "../types/common/Pagination";
import _keyBy from "lodash/keyBy";

export function queryPaginationTransform(response: Response): PaginationProps {
  const count = response.headers.get("count");
  const link = response.headers.get("link");
  const page = response.headers.get("page");
  const perPage = response.headers.get("per-page");
  const links = link ? _keyBy(LinkHeader.parse(link).refs, "rel") : null;
  return {
    count: parseInt(count as string, 10),
    page: parseInt(page as string, 10),
    items: parseInt(perPage as string, 10),
    pages: links ? parseInt(links.last.page, 10) : 1
  };
}

export const qsSettings = { arrayFormat: "brackets", encode: false };

export function transformToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => transformToSnakeCase(v as any));
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/([a-z])([0-9])/g, "$1_$2")
        .toLowerCase();
      (result as any)[snakeKey] = transformToSnakeCase(obj[key] as any);
      return result;
    }, {} as any);
  }
  return obj;
}

export function transformToCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => transformToCamelCase(v as any));
  } else if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((result, key) => {
      if (!obj[key]) {
        (result as any)[key] = obj[key];
        return result;
      }
      const camelKey = key.replace(/_([a-z])/g, g => g[1].toUpperCase());
      (result as any)[camelKey] = transformToCamelCase(obj[key] as any);
      return result;
    }, {} as any);
  }
  return obj;
}
