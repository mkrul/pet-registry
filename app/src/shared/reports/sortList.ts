import sortListJson from "./sortList.json" assert { type: "json" };

const sortList = sortListJson;


export const getSortOptions = () => {
  return [...sortList.options];
};

export const isValidSort = (sort) => {
  return sortList.options.includes(sort);
};
