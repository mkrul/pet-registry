import stateListJson from "../../../../config/states.json" assert { type: "json" };

const stateList = stateListJson;


export const getStateOptions = () => {
  return [...stateList.options].sort();
};

export const isValidState = (state) => {
  return stateList.options.includes(state);
};
