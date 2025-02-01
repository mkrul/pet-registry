import { ReportProps } from "../../../../types/Report";

export interface UpdateReportResponse {
  message: string;
  report: ReportProps;
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
}

export interface SubmitResponse {
  message: string;
  report: ReportProps;
  id: number;
}

export interface ReportsResponse {
  data: ReportProps[];
  pagination: PaginationProps;
  notification?: {
    type: string;
    message: string;
  };
}
