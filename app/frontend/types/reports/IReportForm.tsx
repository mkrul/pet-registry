interface IReport {
  title: string;
  description: string;
  name: string;
  species: string;
  breed1: string;
  breed2?: string;
  color1: string;
  color2?: string;
  color3?: string;
  gender: string;
  imageUrls: string[];
}

export default IReport;
