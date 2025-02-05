export const MAP_ZOOM_LEVELS = {
  EDIT: 17,
  VIEW: 17,
  NEW: 4,
  DEFAULT: 4
} as const;

export type MapZoomLevel = (typeof MAP_ZOOM_LEVELS)[keyof typeof MAP_ZOOM_LEVELS];
