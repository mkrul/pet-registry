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
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}
