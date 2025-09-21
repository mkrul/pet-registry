import { ReportPropsForm } from "./redux/features/reports/ReportsApi";

export type FormPopulateHandlers = {
  setFormData: (data: ReportPropsForm) => void;
  setSelectedImage: (file: File | null) => void;
  setImagePreview: (preview: string) => void;
  setShowBreed2: (show: boolean) => void;
  setShowColor2: (show: boolean) => void;
  setShowColor3: (show: boolean) => void;
};
