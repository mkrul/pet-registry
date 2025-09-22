import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  query: "",
  perPage: 21
};

const petsSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.query = action.payload;
    },
    setPets(state, action) {
      state.data = action.payload;
    },
    setPerPage(state, action) {
      state.perPage = action.payload;
    }
  }
});

export const { setSearchQuery, setPets, setPerPage } = petsSlice.actions;
export default petsSlice.reducer;
