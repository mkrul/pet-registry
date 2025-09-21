export const createMapLocation = (location) => ({
  latitude: location.latitude,
  longitude: location.longitude,
  area: location.area ?? "",
  state: location.state ?? "",
  country: location.country ?? "",
  intersection: location.intersection === null ? undefined : location.intersection
});

export const adaptFormDataToLocation = (formData) => ({
  latitude: formData.latitude || 0,
  longitude: formData.longitude || 0,
  area: formData.area || "",
  state: formData.state || "",
  country: formData.country || "",
  intersection: formData.intersection || ""
});
