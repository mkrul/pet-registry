import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  isPageReady: boolean;
  apiCallsInProgress: number;
  componentsLoading: boolean;
}

const initialState: LoadingState = {
  isPageReady: false,
  apiCallsInProgress: 0,
  componentsLoading: true
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setComponentsLoading: (state, action: PayloadAction<boolean>) => {
      state.componentsLoading = action.payload;
      state.isPageReady = !state.componentsLoading && state.apiCallsInProgress === 0;
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(
        action => action.type.endsWith("/pending"),
        state => {
          state.apiCallsInProgress++;
          state.isPageReady = false;
        }
      )
      .addMatcher(
        action => action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected"),
        state => {
          state.apiCallsInProgress = Math.max(0, state.apiCallsInProgress - 1);
          state.isPageReady = !state.componentsLoading && state.apiCallsInProgress === 0;
        }
      );
  }
});

export const { setComponentsLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
