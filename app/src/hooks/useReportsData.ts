import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setReports } from "../redux/features/reports/reportsSlice";
import { useGetReportsQuery } from "../redux/features/reports/reportsApi";
import { NotificationState, NotificationType } from "../types/common/Notification";
import { FiltersProps } from "../types/common/Search";
import environment from "../config/environment";

// Add logging for debugging
console.log("API URL:", environment.apiUrl);

export const useReportsData = (query: string, filters: FiltersProps, page: number) => {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.reports.data);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const { data, error, isLoading } = useGetReportsQuery({
    page: page || 1,
    query: query || undefined,
    items: 21,
    ...filters
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setReports(data.data));
      console.log("Reports data loaded successfully");
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error && "data" in error) {
      const apiError = error as { data: { message: string } };
      console.error("API Error:", apiError);
      setNotification({
        type: NotificationType.ERROR,
        message: apiError.data?.message
      });
    }
  }, [error]);

  return { reports, data, error, isLoading, notification, setNotification };
};
