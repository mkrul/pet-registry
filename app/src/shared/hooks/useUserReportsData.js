import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReports, setPerPage } from "../../store/features/reports/reportsSlice.js";
import { useGetUserReportsQuery } from "../../store/features/reports/reportsApi.js";

export const useUserReportsData = (page, filter = 'active', preloadAll = false) => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.data);
  const perPage = useSelector((state) => state.reports.perPage);
  const [notification, setNotification] = useState(null);

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
      const apiError = error;
      setNotification({
        type: "ERROR",
        message: apiError.data?.message
      });
    }
  }, [error]);

  const isPreloading = preloadAll && (isLoadingActive || isLoadingArchived);


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
