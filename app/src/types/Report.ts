export interface IReportForm {
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
  image: {
    id: string;
    url: string;
    thumbnailUrl: string;
    variantUrl: string;
    filename: string;
    publicId: string;
  };
  microchipped: boolean | null;
  microchipId: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
}

export interface IReport extends IReportForm {
  id: number;
  status: string;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
  updatedLastThreeDays?: boolean;
}

export interface IReportsState {
  reports: IReport[];
  data: IReport[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  query: string;
}
