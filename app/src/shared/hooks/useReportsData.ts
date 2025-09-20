import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setReports, setPerPage } from "../../store/features/reports/reportsSlice";
import { useGetReportsQuery } from "../../store/features/reports/reportsApi";
import { NotificationState, NotificationType } from "../types/common/Notification";
import { FiltersProps } from "../types/common/Search";
import environment from "../config/environment";

export const useReportsData = (query: string, filters: FiltersProps, page: number) => {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.reports.data);
  const perPage = useSelector((state: RootState) => state.reports.perPage);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const { data, error, isLoading, refetch } = useGetReportsQuery(
    {
      page,
      items: perPage,
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

      // Update perPage from backend response if available
      if (data.pagination?.per_page && data.pagination.per_page !== perPage) {
        dispatch(setPerPage(data.pagination.per_page));
      }

      if (data.message) {
        setNotification({
          type: NotificationType.INFO,
          message: data.message
        });
      } else {
        setNotification(null);
      }
    }
  }, [data, dispatch, perPage]);

  useEffect(() => {
    if (error && "data" in error) {
      const apiError = error as { data: { message: string } };
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
