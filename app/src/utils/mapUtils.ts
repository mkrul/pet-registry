import { LocationData } from "../types/Report";
import { MapCoordinates } from "../types/common/Map";

export const createMapLocation = (
  location: Partial<LocationData & MapCoordinates>
): Partial<LocationData & MapCoordinates> => ({
  latitude: location.latitude,
  longitude: location.longitude,
  area: location.area ?? "",
  state: location.state ?? "",
  country: location.country ?? "",
  intersection: location.intersection ?? ""
});
