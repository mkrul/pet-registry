import { BreedLists } from "./types";
import breedListsJson from "./breedLists.json" assert { type: "json" };

const breedLists = breedListsJson as BreedLists;

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
