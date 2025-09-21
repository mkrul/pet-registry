import { GenderList } from "../types/common/OptionsList";
import genderListJson from "./genderList.json" assert { type: "json" };

const genderList = genderListJson as GenderList;

export type Gender = (typeof genderList.options)[number];

export const getGenderOptions = (): string[] => {
  return [...genderList.options].sort();
};

export const isValidGender = (gender: string): boolean => {
  return genderList.options.includes(gender);
};
