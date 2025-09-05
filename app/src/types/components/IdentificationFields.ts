import { FormInputEvent } from "../forms/FormEvent";
import { ReportPropsForm } from "../redux/features/reports/ReportsApi";

export interface IdentificationFieldsProps {
  formData: ReportPropsForm;
  showBreed2: boolean;
  onInputChange: (e: FormInputEvent) => void;
  setShowBreed2: () => void;
  onBreed2Remove: () => void;
  isLoading: boolean;
  error?: string;
  breedError?: string;
  alteredError?: string;
  microchipError?: string;
}
