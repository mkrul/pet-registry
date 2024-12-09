declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element | null, opts?: MapOptions);
    addListener(eventName: string, handler: Function): void;
  }

  class Marker {
    constructor(opts?: MarkerOptions);
    setMap(map: Map | null): void;
  }

  class Geocoder {
    geocode(
      request: {
        location?: { lat: number; lng: number };
        address?: string;
      },
      callback: (
        results: Array<{
          address_components: Array<{
            long_name: string;
            short_name: string;
            types: string[];
          }>;
        }>,
        status: string
      ) => void
    ): void;
  }

  interface MapOptions {
    center: { lat: number; lng: number };
    zoom: number;
  }

  interface MarkerOptions {
    position: { lat: number; lng: number } | LatLng;
    map: Map;
    draggable?: boolean;
  }

  interface MapMouseEvent {
    latLng: LatLng | null;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }
}
