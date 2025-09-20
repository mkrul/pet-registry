import { LocationData } from "../Report";

export interface MapCoordinates {
  latitude: number;
  longitude: number;
}

export interface MapProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: Partial<LocationData & MapCoordinates>;
  initialZoom: number;
  readOnly?: boolean;
}
