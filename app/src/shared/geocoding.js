import { isUSLocation } from "./utils/locationUtils";

export const findNearestArea = async (lat, lng, onNotification) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
    );

    const data = await response.json();

    if (data && data.address) {
      const areaName =
        data.address.city ||
        data.address.area ||
        data.address.town ||
        data.address.village ||
        data.address.suburb ||
        data.address.neighbourhood ||
        data.address.municipality ||
        data.address.hamlet ||
        data.address.isolated_dwelling ||
        data.address.county;

      if (areaName && !areaName.toLowerCase().includes("unknown")) {
        return areaName;
      }

      const widerResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=8&addressdetails=1`
      );

      const widerData = await widerResponse.json();

      if (widerData && widerData.address) {
        const widerAreaName =
          widerData.address.city ||
          widerData.address.area ||
          widerData.address.town ||
          widerData.address.village ||
          widerData.address.suburb ||
          widerData.address.neighbourhood ||
          widerData.address.municipality ||
          widerData.address.hamlet ||
          widerData.address.isolated_dwelling ||
          widerData.address.county;

        if (widerAreaName && !widerAreaName.toLowerCase().includes("unknown")) {
          return widerAreaName;
        }
      }
    }
    return "Unknown Location";
  } catch (error) {
    onNotification({
      type: "ERROR",
      message:
        "The map does not recognize the location you selected. Please choose a different location."
    });
    return "Unknown Location";
  }
};

export const findNearbyStreets = async (lat, lng) => {
  try {
    const mainResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );

    const mainData = await mainResponse.json();
    const mainRoad = mainData?.address?.road;

    if (!mainRoad) {
      return null;
    }

    const radius = 100;
    const query = `
      [out:json][timeout:25];
      (
        way(around:${radius},${lat},${lng})[highway~"^(primary|secondary|tertiary|residential|unclassified)$"][name];
      );
      out body;
      >;
      out skel qt;
    `;

    const overpassResponse = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
    );

    const overpassData = await overpassResponse.json();

    const roads = overpassData.elements
      .filter(
        (element) =>
          element.tags?.name && element.tags.name.toLowerCase() !== mainRoad.toLowerCase()
      )
      .map((element) => element.tags?.name)
      .filter((name) => !!name);

    if (roads.length === 0) {
      const widerQuery = query.replace(`${radius}`, "200");
      const widerResponse = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(widerQuery)}`
      );
      const widerData = await widerResponse.json();

      roads.push(
        ...widerData.elements
          .filter(
            (element) =>
              element.tags?.name && element.tags.name.toLowerCase() !== mainRoad.toLowerCase()
          )
          .map((element) => element.tags?.name)
          .filter((name) => !!name)
      );
    }

    return roads.length > 0 ? `${mainRoad} at ${roads[0]}` : null;
  } catch (error) {
    return null;
  }
};

export const getLocationDetails = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?` +
        `format=json&` +
        `lat=${lat}&` +
        `lon=${lng}&` +
        `addressdetails=1`
    );
    const data = await response.json();
    return {
      area:
        data.address.city || data.address.town || data.address.village || data.address.county || "",
      address: {
        state: data.address.state || "",
        country: data.address.country || ""
      },
      intersectionStr: data.display_name || ""
    };
  } catch (error) {
    return null;
  }
};

export const processAddress = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    const address = data.address;

    if (!isUSLocation(address.country || "")) {
      return {
        latitude: lat,
        longitude: lng,
        area: "",
        state: "",
        country: address.country || "",
        intersection: "",
        error: "Sorry, we are only able to support US locations at this time."
      };
    }

    let area =
      address.area ||
      address.town ||
      address.village ||
      address.suburb ||
      address.municipality ||
      address.neighbourhood;

    if (!area || area === "Unknown") {
      area = await findNearestArea(lat, lng, () => {});
    }

    const intersectionStr = await findNearbyStreets(lat, lng);

    return {
      latitude: lat,
      longitude: lng,
      area,
      state: address.state || "",
      country: address.country || "",
      intersection: intersectionStr || ""
    };
  } catch (error) {
    return {
      latitude: lat,
      longitude: lng,
      area: "",
      state: "",
      country: "",
      intersection: "",
      error: "Error processing location"
    };
  }
};
