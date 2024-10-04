import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IReport } from "../../../types/reports/Report";

interface ReportsState {
  data: IReport[];
}

const initialState: ReportsState = {
  data: [],
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
});

export default reportsSlice.reducer;
