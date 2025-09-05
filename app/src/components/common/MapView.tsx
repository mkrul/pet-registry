import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import { MapProps } from "../../types/common/Map";
import { DEFAULT_MAP_CENTER } from "../../constants/map";

interface MapViewProps extends Pick<MapProps, "initialLocation" | "initialZoom"> {
  hasSetInitialView: boolean;
  setHasSetInitialView: (value: boolean) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  initialLocation,
  initialZoom,
  hasSetInitialView,
  setHasSetInitialView
}) => {
  const map = useMap();

  useEffect(() => {
    if (initialLocation?.latitude && initialLocation?.longitude) {
      map.setView([initialLocation.latitude, initialLocation.longitude], initialZoom, {
        animate: true
      });
      if (!hasSetInitialView) {
        setHasSetInitialView(true);
      }
    } else if (!hasSetInitialView) {
      map.setView([DEFAULT_MAP_CENTER.latitude, DEFAULT_MAP_CENTER.longitude], initialZoom, {
        animate: true
      });
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
