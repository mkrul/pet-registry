import { ColorLists } from "./types";
import colorListsJson from "./colorLists.json" assert { type: "json" };

const colorLists = colorListsJson as ColorLists;

export type Color = (typeof colorLists.options)[number];

export const getColorOptions = (): string[] => {
  return [...colorLists.options].sort();
};

export const isValidColor = (color: string): boolean => {
  return colorLists.options.includes(color);
};
