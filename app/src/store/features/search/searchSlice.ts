import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FiltersProps } from "../../../shared/types/common/Search";

interface SearchState {
  query: string;
  page: number;
  filters: FiltersProps;
  scrollPosition: number;
}

const initialState: SearchState = {
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
    setSearchState: (state, action: PayloadAction<SearchState>) => {
      state.query = action.payload.query;
      state.page = action.payload.page;
      state.filters = action.payload.filters;
      state.scrollPosition = action.payload.scrollPosition;
    },
    setScrollPosition: (state, action: PayloadAction<number>) => {
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
