import { LocationData } from "../Report";

export interface MapProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: Partial<LocationData>;
  initialZoom: number;
  readOnly?: boolean;
}

export interface MapLocation {
  latitude: number;
  longitude: number;
  area: string;
  state: string;
  country: string;
  intersection: string;
}
