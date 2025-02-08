import { Species } from "../../lib/reports/breedList";
export interface BreedSearchProps {
  species: Species | "";
  value: string;
  onChange: (breed: string) => void;
  excludeBreeds?: string[];
  required?: boolean;
  disabled?: boolean;
  hideLabel?: boolean;
  size?: "small" | "medium";
  disableClearable?: boolean;
  error?: boolean;
  "data-testid"?: string;
}
