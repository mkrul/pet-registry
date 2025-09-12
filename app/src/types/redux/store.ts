export interface RootState {
  auth: AuthState;
  reports: ReportState;
  search: SearchState;
  notifications: NotificationState;
  loading: {
    isPageReady: boolean;
    apiCallsInProgress: number;
    componentsLoading: boolean;
  };
}
