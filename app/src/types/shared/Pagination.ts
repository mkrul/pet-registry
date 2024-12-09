export interface IPaginationQuery {
  page: number;
  query: string;
  species: string[];
  gender: string[];
  color: string[];
  status: string[];
  sort: string;
}

export interface IPaginationResponse {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  nextPage: number | null;
  prevPage: number | null;
}
