interface IReport {
  id?: number;
  title: string;
  description: string;
  name?: string;
  status: string;
  species: string;
  breed1: string;
  breed2?: string;
  color1: string;
  color2?: string;
  color3?: string;
  gender: string;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
  imageUrls: string[];
}

export default IReport;
