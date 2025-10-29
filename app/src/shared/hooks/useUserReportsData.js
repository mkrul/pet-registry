import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReports, setPerPage } from "../../store/features/reports/reportsSlice.js";
import { useGetUserReportsQuery } from "../../store/features/reports/reportsApi.js";
import { addNotification } from "../../store/features/notifications/notificationsSlice.js";

export const useUserReportsData = (page, filter = 'active', preloadAll = false, skip = false) => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.data);
  const perPage = useSelector((state) => state.reports.perPage);

  const { data, error, isLoading, refetch } = useGetUserReportsQuery(
    {
      page,
      items: perPage,
      status: filter
    },
    {
      refetchOnMountOrArgChange: false,
      skip
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
      skip: skip || !preloadAll || filter === 'active'
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
      skip: skip || !preloadAll || filter === 'archived'
    }
  );

  useEffect(() => {
    if (data?.data) {
      dispatch(setReports(data.data));

      if (data.pagination?.per_page && data.pagination.per_page !== perPage) {
        dispatch(setPerPage(data.pagination.per_page));
      }
    }
  }, [data, dispatch, perPage]);

  useEffect(() => {
    if (error && "data" in error) {
      const apiError = error;
      const errorMessage = apiError.data?.message || "An error occurred while loading user reports";
      dispatch(addNotification({
        type: "ERROR",
        message: errorMessage
      }));
    }
  }, [error, dispatch]);

  const isPreloading = preloadAll && (isLoadingActive || isLoadingArchived);


  return {
    reports: data?.data || [],
    data,
    isLoading,
    isPreloading,
    error,
    refetch
  };
};
