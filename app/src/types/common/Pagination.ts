export interface PaginationProps {
  count: number;
  page: number;
  items: number;
  pages: number;
}

export interface PaginationPagesProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
