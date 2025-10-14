import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReports, setPerPage } from "../../store/features/reports/reportsSlice.js";
import { useGetReportsQuery } from "../../store/features/reports/reportsApi.js";
import { addNotification } from "../../store/features/notifications/notificationsSlice.js";
import environment from "../../config/environment.js";

export const useReportsData = (query, filters, page) => {
  const dispatch = useDispatch();
  const reports = useSelector((state) => state.reports.data);
  const perPage = useSelector((state) => state.reports.perPage);

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

      if (data.pagination?.per_page && data.pagination.per_page !== perPage) {
        dispatch(setPerPage(data.pagination.per_page));
      }

      if (data.message) {
        dispatch(addNotification({
          type: "INFO",
          message: data.message
        }));
      }
    }
  }, [data, dispatch, perPage]);

  useEffect(() => {
    if (error && "data" in error) {
      const apiError = error;
      dispatch(addNotification({
        type: "ERROR",
        message: apiError.data?.message
      }));
    }
  }, [error, dispatch]);

  return {
    reports: data?.data || [],
    data,
    isLoading,
    error,
    refetch
  };
};
