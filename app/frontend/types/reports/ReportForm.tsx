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
  images: string[];
  microchipped: boolean | null;
  microchipId: string | null;
}
