import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setReports } from "../redux/features/reports/reportsSlice";
import { useGetReportsQuery } from "../redux/features/reports/reportsApi";
import { NotificationState, NotificationType } from "../types/Notification";
import { IFilters } from "../types/search/Search";

export const useReportsData = (query: string, filters: IFilters, page: number) => {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.reports.data);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const { data, error, isLoading } = useGetReportsQuery({
    page: page || 1,
    query: query || undefined,
    ...filters
  });

  useEffect(() => {
    if (data?.data) {
      dispatch(setReports(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error && "data" in error) {
      const apiError = error as { data: { message: string } };
      setNotification({
        type: NotificationType.ERROR,
        message: apiError.data?.message
      });
    }
  }, [error]);

  return { reports, data, error, isLoading, notification, setNotification };
};
