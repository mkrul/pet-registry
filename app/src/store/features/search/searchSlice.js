import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  page: 1,
  filters: {
    species: "",
    color: "",
    gender: "",
    area: "",
    state: "",
    country: "",
    sort: "Newest",
    breed: ""
  },
  scrollPosition: 0
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchState: (state, action) => {
      state.query = action.payload.query;
      state.page = action.payload.page;
      state.filters = action.payload.filters;
      state.scrollPosition = action.payload.scrollPosition;
    },
    setScrollPosition: (state, action) => {
      state.scrollPosition = action.payload;
    },
    clearSearchState: state => {
      state.query = initialState.query;
      state.page = initialState.page;
      state.filters = initialState.filters;
      state.scrollPosition = initialState.scrollPosition;
    }
  }
});

export const { setSearchState, clearSearchState, setScrollPosition } = searchSlice.actions;
export default searchSlice.reducer;
