export interface MapProps {
  onLocationSelect?: (location: MapLocation) => void;
  initialLocation?: {
    latitude: number | null;
    longitude: number | null;
  };
  initialZoom?: number;
  readOnly?: boolean;
}

export interface MapLocation {
  latitude: number;
  longitude: number;
  area: string;
  state: string;
  country: string;
  intersection: string | null;
}
