import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReportProps } from "../../../types/Report";
import { ReportPropsState } from "../../../types/Report";

const initialState: ReportPropsState = {
  data: [],
  query: ""
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
    }
  }
});

export const { setSearchQuery, setReports } = reportsSlice.actions;
export default reportsSlice.reducer;
