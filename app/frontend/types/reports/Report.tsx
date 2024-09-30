import Image from "../shared/Image";

interface IReport {
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
  images: Image[];
  microchipped: boolean | null;
  microchipId: string | null;
}

export default IReport;
