import genderListJson from "../../../../config/genders.json" assert { type: "json" };

const genderList = genderListJson;


export const getGenderOptions = () => {
  return [...genderList.options].sort();
};

export const isValidGender = (gender) => {
  return genderList.options.includes(gender);
};
