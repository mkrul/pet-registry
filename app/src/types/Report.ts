export interface IReportForm {
  title: string;
  description: string;
  name: string;
  gender: string;
  species: string;
  breed1: string;
  breed2: string;
  color1: string;
  color2: string;
  color3: string;
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
}
