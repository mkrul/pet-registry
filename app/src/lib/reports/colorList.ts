import { ColorList } from "../../types/common/OptionsList";
import colorListJson from "./colorList.json" assert { type: "json" };

const colorList = colorListJson as ColorList;

export type Color = (typeof colorList.options)[number];

export const getColorOptions = (): string[] => {
  return [...colorList.options].sort();
};

export const isValidColor = (color: string): boolean => {
  return colorList.options.includes(color);
};
