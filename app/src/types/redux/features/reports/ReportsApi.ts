import { ReportProps } from "../../../../types/Report";
import { PaginationProps } from "../../../../types/common/Pagination";

export interface UpdateReportResponse {
  message: string;
  report: ReportProps;
}

export interface SubmitResponse {
  message: string;
  report: ReportProps;
  id: number;
}

export interface ReportsResponse {
  data: ReportProps[];
  pagination: PaginationProps;
  message?: string;
  notification?: {
    type: string;
    message: string;
  };
}
