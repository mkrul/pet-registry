import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FiltersProps } from "../../../types/common/Search";

interface SearchState {
  query: string;
  page: number;
  filters: FiltersProps;
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
  }
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchState: (state, action: PayloadAction<SearchState>) => {
      state.query = action.payload.query;
      state.page = action.payload.page;
      state.filters = action.payload.filters;
    },
    clearSearchState: state => {
      state.query = initialState.query;
      state.page = initialState.page;
      state.filters = initialState.filters;
    }
  }
});

export const { setSearchState, clearSearchState } = searchSlice.actions;
export default searchSlice.reducer;
