export interface PaginationProps {
  count: number;
  page: number;
  items: number;
  pages: number;
  per_page: number;
}
export interface PaginationPropsQuery {
  page: number;
  items: number;
  query?: string;
  species?: string;
  color?: string;
  gender?: string;
  sort?: string;
  country?: string;
  state?: string;
  area?: string;
  breed?: string;
  archived?: boolean;
}

export interface PaginationPagesProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
