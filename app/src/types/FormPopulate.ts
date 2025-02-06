import { ReportPropsForm } from "./Report";

export type FormPopulateHandlers = {
  setFormData: (data: React.SetStateAction<ReportPropsForm>) => void;
  setSelectedImage: (file: File | null) => void;
  setImagePreview: (preview: string) => void;
  setShowBreed2: (show: boolean) => void;
  setShowColor2: (show: boolean) => void;
  setShowColor3: (show: boolean) => void;
};
