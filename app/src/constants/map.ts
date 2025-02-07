import { MapCoordinates } from "../types/common/Map";

export const MAP_ZOOM_LEVELS = {
  EDIT: 17,
  VIEW: 17,
  NEW: 4,
  DEFAULT: 4,
  PIN_DROP: 8
} as const;

export type MapZoomLevel = (typeof MAP_ZOOM_LEVELS)[keyof typeof MAP_ZOOM_LEVELS];

export const DEFAULT_MAP_CENTER: MapCoordinates = {
  latitude: 39.8283,
  longitude: -98.5795
} as const;
