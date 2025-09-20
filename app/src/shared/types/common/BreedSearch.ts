import { Species } from "../../../../shared/reports/breedList";
export interface BreedSearchProps {
  species: Species | null;
  value: string | null;
  onChange: (breed: string) => void;
  excludeBreeds?: string[];
  required?: boolean;
  disabled?: boolean;
  hideLabel?: boolean;
  size?: "small" | "medium";
  disableClearable?: boolean;
  error?: boolean;
  onEmptySpeciesClick?: () => void;
  showBreedPlaceholder?: boolean;
  "data-testid"?: string;
}
