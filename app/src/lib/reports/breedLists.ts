import breedLists from "./breedLists.json";

export type Species = "dog" | "cat";
export type BreedLists = typeof breedLists;

export const getBreedsBySpecies = (species: Species | null): string[] => {
  if (!species) return [];
  return breedLists[species.toLowerCase() as Species] || [];
};

export const isValidBreed = (species: Species | null, breed: string): boolean => {
  if (!species || !breed) return false;
  const breedList = getBreedsBySpecies(species);
  return breedList.includes(breed.toLowerCase());
};
