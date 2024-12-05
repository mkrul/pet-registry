export interface IPaginationQuery {
  page: number;
  items: number;
  query?: string;
  species?: string;
  color?: string;
  gender?: string;
  sort?: string;
}

export interface IPagination {
  count: number;
  page: number;
  items: number;
  pages: number;
}
