import { ReportProps } from "../../../../types/Report";
import { PaginationProps } from "../../../../types/common/Pagination";

export interface UpdateReportResponse {
  message: string;
  report: ReportProps;
}

export interface ValidationErrorResponse {
  message: string;
  id?: number;
  report?: ReportProps;
}

export interface SubmitResponse extends ReportProps {
  message: string;
  report: ReportProps;
  id: number;
  data: ReportProps;
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

export interface ErrorResponse {
  data: {
    message?: string;
    errors?: Record<string, string>;
  };
}

export interface ReportPropsForm {
  title: string;
  description: string;
  name: string;
  gender: string;
  species: string;
  breed1: string;
  breed2: string | null;
  color1: string;
  color2: string | null;
  color3: string | null;
  altered: 0 | 1 | null;
  image: {
    id: string;
    url: string;
    thumbnailUrl: string;
    variantUrl: string;
    filename: string;
    publicId: string;
  };
  microchipId: string;
  area: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  intersection: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  area: string;
  state: string;
  country: string;
  intersection: string;
}
