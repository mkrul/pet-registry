export interface IPagination {
  count: number;
  items: number;
  pages: number;
  page: number;
}
export interface IPaginationQuery {
  page: number;
  items: number;
  query?: string;
  species?: string;
  color?: string;
  gender?: string;
  sort?: string;
  country?: string;
  state?: string;
}
