import { SpeciesLists } from "./types";
import speciesListsJson from "./speciesLists.json" assert { type: "json" };

const speciesLists = speciesListsJson as SpeciesLists;

export type Species = (typeof speciesLists.options)[number];

export const getSpeciesOptions = (): string[] => {
  return [...speciesLists.options].sort();
};

export const isValidSpecies = (species: string): boolean => {
  return speciesLists.options.includes(species);
};
