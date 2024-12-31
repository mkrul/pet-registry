export interface MapProps {
  onLocationSelect?: (location: {
    latitude: number;
    longitude: number;
    area: string;
    state: string;
    country: string;
  }) => void;
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
  area?: string;
  state?: string;
  country?: string;
}
