import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  query: "",
  perPage: null
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.query = action.payload;
    },
    setReports(state, action) {
      state.data = action.payload;
    },
    setPerPage(state, action) {
      state.perPage = action.payload;
    }
  }
});

export const { setSearchQuery, setReports, setPerPage } = reportsSlice.actions;
export default reportsSlice.reducer;
