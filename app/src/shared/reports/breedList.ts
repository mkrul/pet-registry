import breedListJson from "../../../../config/breeds.json";

const breedList = breedListJson as { dog: string[]; cat: string[] };

export type Species = "dog" | "cat";
export type DogBreed = (typeof breedList.dog)[number];
export type CatBreed = (typeof breedList.cat)[number];
export type Breed = DogBreed | CatBreed;

export const getBreedsBySpecies = (species: Species | null): string[] => {
  if (!species) return [];
  return breedList[species.toLowerCase() as Species] || [];
};

export const isValidBreed = (species: Species | null, breed: string): boolean => {
  if (!species || !breed) return false;
  const breedList = getBreedsBySpecies(species);
  return breedList.includes(breed);
};
