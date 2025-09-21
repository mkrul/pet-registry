import { LocationData, ReportPropsForm } from "../types/redux/features/reports/ReportsApi";
import { ReportProps } from "../../features/reports/types/Report";
import { MapCoordinates } from "../types/common/Map";

export const createMapLocation = (
  location: Partial<LocationData & MapCoordinates> | ReportProps
): Partial<LocationData & MapCoordinates> => ({
  latitude: location.latitude,
  longitude: location.longitude,
  area: location.area ?? "",
  state: location.state ?? "",
  country: location.country ?? "",
  intersection: location.intersection === null ? undefined : location.intersection
});

export const adaptFormDataToLocation = (
  formData: ReportPropsForm
): Partial<LocationData & MapCoordinates> => ({
  latitude: formData.latitude || 0,
  longitude: formData.longitude || 0,
  area: formData.area || "",
  state: formData.state || "",
  country: formData.country || "",
  intersection: formData.intersection || ""
});
