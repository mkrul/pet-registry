import { SxProps } from "@mui/material";
import { Species } from "../../lib/reports/breedList";

export interface BreedSearchProps {
  species: Species | "";
  value: string;
  onChange: (value: string) => void;
  variant?: "form" | "filter";
  required?: boolean;
  label?: string;
  sx?: SxProps;
  excludeBreeds?: string[];
}
