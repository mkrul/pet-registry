import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setReports } from "../redux/features/reports/reportsSlice";
import { useGetReportsQuery } from "../redux/features/reports/reportsApi";
import { NotificationState, NotificationType } from "../types/common/Notification";
import { FiltersProps } from "../types/common/Search";
import environment from "../config/environment";

export const useReportsData = (query: string, filters: FiltersProps, page: number) => {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.reports.data);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const { data, error, isLoading, refetch } = useGetReportsQuery(
    {
      page,
      items: 20,
      query,
      ...filters
    },
    {
      refetchOnMountOrArgChange: false
    }
  );

  useEffect(() => {
    if (data?.data) {
      dispatch(setReports(data.data));
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

  return {
    reports: data?.data || [],
    data,
    isLoading,
    error,
    notification,
    setNotification,
    refetch
  };
};
