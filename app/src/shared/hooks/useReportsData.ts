import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReports, setPerPage } from "../../store/features/reports/reportsSlice";
import { useGetReportsQuery } from "../../store/features/reports/reportsApi";
import environment from "../../config/environment";

export const useReportsData = (query, filters, page) => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.data);
  const perPage = useSelector((state) => state.reports.perPage);
  const [notification, setNotification] = useState(null);

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
          type: "INFO",
          message: data.message
        });
      } else {
        setNotification(null);
      }
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
