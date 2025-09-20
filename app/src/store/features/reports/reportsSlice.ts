import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReportProps, ReportPropsState } from "../../../../features/reports/types/Report";

const initialState: ReportPropsState = {
  data: [],
  query: "",
  perPage: 21 // Default value, will be updated from API response
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setReports(state, action: PayloadAction<ReportProps[]>) {
      state.data = action.payload;
    },
    setPerPage(state, action: PayloadAction<number>) {
      state.perPage = action.payload;
    }
  }
});

export const { setSearchQuery, setReports, setPerPage } = reportsSlice.actions;
export default reportsSlice.reducer;
