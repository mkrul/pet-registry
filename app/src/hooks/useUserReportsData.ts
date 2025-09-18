import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setReports, setPerPage } from "../redux/features/reports/reportsSlice";
import { useGetUserReportsQuery } from "../redux/features/reports/reportsApi";
import { NotificationState, NotificationType } from "../types/common/Notification";
import { PaginationPropsQuery } from "../types/common/Pagination";

type ReportFilter = 'active' | 'archived';

export const useUserReportsData = (page: number, filter: ReportFilter = 'active', preloadAll: boolean = false) => {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.reports.data);
  const perPage = useSelector((state: RootState) => state.reports.perPage);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const { data, error, isLoading, refetch } = useGetUserReportsQuery(
    {
      page,
      items: perPage,
      status: filter
    },
    {
      refetchOnMountOrArgChange: false
    }
  );

  const { data: activeData, isLoading: isLoadingActive } = useGetUserReportsQuery(
    {
      page: 1,
      items: perPage,
      status: 'active'
    },
    {
      refetchOnMountOrArgChange: false,
      skip: !preloadAll || filter === 'active'
    }
  );

  const { data: archivedData, isLoading: isLoadingArchived } = useGetUserReportsQuery(
    {
      page: 1,
      items: perPage,
      status: 'archived'
    },
    {
      refetchOnMountOrArgChange: false,
      skip: !preloadAll || filter === 'archived'
    }
  );

  useEffect(() => {
    if (data?.data) {
      dispatch(setReports(data.data));

      if (data.pagination?.per_page && data.pagination.per_page !== perPage) {
        dispatch(setPerPage(data.pagination.per_page));
      }

      setNotification(null);
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

  const isPreloading = preloadAll && (isLoadingActive || isLoadingArchived);

  console.log('useUserReportsData - filter:', filter, 'preloadAll:', preloadAll, 'isLoading:', isLoading, 'isLoadingActive:', isLoadingActive, 'isLoadingArchived:', isLoadingArchived, 'isPreloading:', isPreloading);

  return {
    reports: data?.data || [],
    data,
    isLoading,
    isPreloading,
    error,
    notification,
    setNotification,
    refetch
  };
};
