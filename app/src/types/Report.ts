import { IImage } from "./shared/Image";
import { IPagination } from "./shared/Pagination";
export interface IReport {
  id: number;
  title: string;
  description: string;
  name: string | null;
  status: string;
  species: string;
  breed1: string;
  breed2: string | null;
  color1: string;
  color2: string | null;
  color3: string | null;
  gender: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  image: IImage;
  microchipId: string | null;
  updatedLastThreeDays: boolean;
  area: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
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
  name: string | null;
  species: string;
  breed1: string;
  breed2: string | null;
  color1: string;
  color2: string | null;
  color3: string | null;
  gender: string | null;
  microchipId: string | null;
  image: IImage;
  area: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}
