import speciesListJson from "../../../../config/species.json" assert { type: "json" };

const speciesList = speciesListJson;


export const getSpeciesOptions = () => {
  return [...speciesList.options].sort();
};

export const isValidSpecies = (species) => {
  return speciesList.options.includes(species);
};
