import { GenderLists } from "./types";
import genderListsJson from "./genderLists.json" assert { type: "json" };

const genderLists = genderListsJson as GenderLists;

export type Gender = (typeof genderLists.options)[number];

export const getGenderOptions = (): string[] => {
  return [...genderLists.options].sort();
};

export const isValidGender = (gender: string): boolean => {
  return genderLists.options.includes(gender);
};
