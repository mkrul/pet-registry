import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IReport, IReportsState } from "../../../types/Report";

const initialState: IReportsState = {
  reports: [],
  data: [],
  status: "idle",
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalCount: 0,
  query: ""
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    setReports: (state, action: PayloadAction<IReport[]>) => {
      state.data = action.payload;
      state.reports = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setStatus: (state, action: PayloadAction<IReportsState["status"]>) => {
      state.status = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<{
        currentPage: number;
        totalPages: number;
        totalCount: number;
      }>
    ) => {
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalCount = action.payload.totalCount;
    }
  }
});

export const { setReports, setQuery, setStatus, setError, setPagination } = reportsSlice.actions;

export default reportsSlice.reducer;
