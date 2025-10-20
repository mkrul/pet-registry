import React, { useEffect } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { useGetReportQuery } from "../../../store/features/reports/reportsApi.js";
import ListingDetailsCard from "../components/ListingDetailsCard.jsx";
import Spinner from "../../../shared/components/common/Spinner.jsx";
import { useDispatch } from "react-redux";
import { addNotification } from "../../../store/features/notifications/notificationsSlice.js";

const ListingShowView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: report, error, isLoading } = useGetReportQuery(Number(id));
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const currentQuery = searchParams.get("query") || "";
  const currentPageParam = searchParams.get("page");
  const currentPage = currentPageParam ? parseInt(currentPageParam, 10) : 1;

  useEffect(() => {
    if (error && "data" in error) {
      const apiError = error;
      dispatch(
        addNotification({
          type: "ERROR",
          message: apiError.data.message
        })
      );
    }
  }, [error, dispatch]);

  const errors = error ? [error.toString()] : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner bgFaded={false} />
      </div>
    );
  }

  if (!report) {
    return <div>No report found</div>;
  }

  return (
    <div data-testid="report-show">
      <ListingDetailsCard report={report} />
    </div>
  );
};

export default ListingShowView;
