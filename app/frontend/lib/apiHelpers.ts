import LinkHeader from "http-link-header";
import _keyBy from "lodash/keyBy";

export function queryPaginationTransform(response: Response) {
  const total = response.headers.get("total");
  const link = response.headers.get("link");
  const page = response.headers.get("page");
  const perPage = response.headers.get("per-page");
  const links = link ? _keyBy(LinkHeader.parse(link).refs, "rel") : null;
  return {
    links,
    page: parseInt(page as string, 10),
    total: parseInt(total as string, 10),
    perPage: parseInt(perPage as string, 10)
  };
}

export const qsSettings = { arrayFormat: "brackets", encode: false };

export function transformToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => transformToSnakeCase(v));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      // Converts camelCase to snake_case (handles numbers and no-numbers)
      const snakeKey = key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/([a-z])([0-9])/g, '$1_$2').toLowerCase();
      result[snakeKey] = transformToSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}
