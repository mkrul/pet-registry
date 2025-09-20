import { SpeciesList } from "../types/common/OptionsList";
import speciesListJson from "../../../../config/species.json" assert { type: "json" };

const speciesList = speciesListJson as SpeciesList;

export type Species = (typeof speciesList.options)[number];

export const getSpeciesOptions = (): string[] => {
  return [...speciesList.options].sort();
};

export const isValidSpecies = (species: string): boolean => {
  return speciesList.options.includes(species);
};
