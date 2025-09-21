import breedListJson from "../../../../config/breeds.json";

const breedList = breedListJson;


export const getBreedsBySpecies = (species) => {
  if (!species) return [];
  return breedList[species.toLowerCase()] || [];
};

export const isValidBreed = (species, breed) => {
  if (!species || !breed) return false;
  const breedList = getBreedsBySpecies(species);
  return breedList.includes(breed);
};
