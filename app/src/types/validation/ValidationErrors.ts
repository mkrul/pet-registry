export interface ValidationErrors {
  title: string;
  description: string;
  species: string;
  breed1: string;
  breed2: string;
  color1: string;
  color2: string;
  color3: string;
  isAltered: boolean;
  microchipId: string;
  image: string;
  location: string;
  [key: string]: string;
}
