import colorListJson from "../../../../config/colors.json";

const colorList = colorListJson;


export const getColorOptions = () => {
  return [...colorList.options].sort();
};

export const isValidColor = (color) => {
  return colorList.options.includes(color);
};
