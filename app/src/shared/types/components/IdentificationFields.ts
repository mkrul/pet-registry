import { FormInputEvent } from "../forms/FormEvent";
import { ReportPropsForm } from "../redux/features/reports/ReportsApi";

export interface IdentificationFieldsProps {
  formData: ReportPropsForm;
  onInputChange: (e: FormInputEvent) => void;
  isLoading: boolean;
  error?: string;
  breedError?: string;
  alteredError?: string;
  microchipError?: string;
}
