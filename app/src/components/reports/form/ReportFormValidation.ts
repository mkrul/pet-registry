import { ReportPropsForm } from "../../../types/Report";

export const validateReportForm = (formData: ReportPropsForm, selectedImage: File | null) => {
  if (!formData.title?.trim()) {
    return "Title is required";
  }
  if (!formData.description.trim()) return "Description is required";
  if (!formData.species) return "Species is required";
  if (!formData.breed1) return "Primary breed is required";
  if (!formData.color1) return "Primary color is required";
  if (!selectedImage && !formData.image?.url) return "Image is required";
  if (!formData.latitude || !formData.longitude) return "Location is required";
  return null;
};
