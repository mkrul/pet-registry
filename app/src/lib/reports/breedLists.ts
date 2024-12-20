import breedListsJson from "../../../../config/breeds.json";

const breedLists = breedListsJson as { dog: string[]; cat: string[] };

export type Species = "dog" | "cat";
export type DogBreed = (typeof breedLists.dog)[number];
export type CatBreed = (typeof breedLists.cat)[number];
export type Breed = DogBreed | CatBreed;

export const getBreedsBySpecies = (species: Species | null): string[] => {
  if (!species) return [];
  return breedLists[species.toLowerCase() as Species] || [];
};

export const isValidBreed = (species: Species | null, breed: string): boolean => {
  if (!species || !breed) return false;
  const breedList = getBreedsBySpecies(species);
  return breedList.includes(breed);
};
