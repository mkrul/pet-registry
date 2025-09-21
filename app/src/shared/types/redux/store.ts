import { AuthState } from "../../../features/auth/types/AuthState";
import { ReportPropsState } from "../../../features/reports/types/Report";
import { NotificationState } from "../common/Notification";

interface SearchState {
  query: string;
  page: number;
  filters: any;
  scrollPosition: number;
}

export interface RootState {
  auth: AuthState;
  reports: ReportPropsState;
  search: SearchState;
  notifications: NotificationState;
  loading: {
    isPageReady: boolean;
    apiCallsInProgress: number;
    componentsLoading: boolean;
  };
}
