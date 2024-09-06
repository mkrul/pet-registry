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