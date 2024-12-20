import { SortLists } from "./types";
import sortListsJson from "./sortLists.json" assert { type: "json" };

const sortLists = sortListsJson as SortLists;

export type Sort = (typeof sortLists.options)[number];

export const getSortOptions = (): string[] => {
  return [...sortLists.options];
};

export const isValidSort = (sort: string): boolean => {
  return sortLists.options.includes(sort);
};
