import { StateList } from "../../types/common/OptionsList";
import stateListJson from "./stateList.json" assert { type: "json" };

const stateList = stateListJson as StateList;

export type State = (typeof stateList.options)[number];

export const getStateOptions = (): string[] => {
  return [...stateList.options].sort();
};

export const isValidState = (state: string): boolean => {
  return stateList.options.includes(state);
};
