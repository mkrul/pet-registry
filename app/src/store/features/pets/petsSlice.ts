import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PetProps } from "../../../features/pets/types/Pet";

const initialState = {
  data: [] as PetProps[],
  query: "",
  perPage: 21
};

const petsSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setPets(state, action: PayloadAction<PetProps[]>) {
      state.data = action.payload;
    },
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
    }
  }
});

export const { setSearchQuery, setPets, setPerPage } = petsSlice.actions;
export default petsSlice.reducer;
