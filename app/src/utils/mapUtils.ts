import { LocationData, ReportProps } from "../types/Report";
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
