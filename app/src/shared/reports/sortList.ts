import { SortList } from "../../../shared/types/common/OptionsList";
import sortListJson from "./" assert { type: "json" };

const sortList = sortListJson as SortList;

export type Sort = (typeof sortList.options)[number];

export const getSortOptions = (): string[] => {
  return [...sortList.options];
};

export const isValidSort = (sort: string): boolean => {
  return sortList.options.includes(sort);
};
