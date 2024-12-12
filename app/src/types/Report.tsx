import { IImage } from "./shared/Image";
import { IPagination } from "./shared/Pagination";
export interface IReport {
  id: number;
  title: string;
  description: string;
  name: string;
  status: string;
  species: string;
  breed1: string;
  breed2: string | null;
  color1: string;
  color2: string | null;
  color3: string | null;
  gender: string;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  image: IImage;
  microchipped: boolean | null;
  microchipId: string | null;
  updatedLastThreeDays: boolean;
}

export interface IReportsState {
  data: IReport[];
  query: string;
}
export interface GetReportsResponse {
  data: IReport[];
  pagination: IPagination;
}

export interface IReportForm {
  title: string;
  description: string;
  name: string;
  species: string;
  breed1: string;
  breed2: string | null;
  color1: string;
  color2: string | null;
  color3: string | null;
  gender: string;
  microchipped: boolean | null;
  microchipId: string | null;
  image: IImage;
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}
