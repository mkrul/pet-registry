import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import { DEFAULT_MAP_CENTER } from "../../constants/map";


export const MapView = ({
  initialLocation,
  initialZoom,
  hasSetInitialView,
  setHasSetInitialView
}) => {
  const map = useMap();

  useEffect(() => {
    if (!hasSetInitialView) {
      if (initialLocation?.latitude && initialLocation?.longitude) {
        map.setView([initialLocation.latitude, initialLocation.longitude], initialZoom, {
          animate: true
        });
      } else {
        map.setView([DEFAULT_MAP_CENTER.latitude, DEFAULT_MAP_CENTER.longitude], initialZoom, {
          animate: true
        });
      }
      setHasSetInitialView(true);
    }
  }, [
    map,
    initialLocation?.latitude,
    initialLocation?.longitude,
    initialZoom,
    hasSetInitialView,
    setHasSetInitialView
  ]);

  return null;
};
