import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IReport } from "../../../types/Report";
import { IReportsState } from "../../../types/Report";

const initialState: IReportsState = {
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
    setReports(state, action: PayloadAction<IReport[]>) {
      state.data = action.payload;
    }
  }
});

export const { setSearchQuery, setReports } = reportsSlice.actions;
export default reportsSlice.reducer;
