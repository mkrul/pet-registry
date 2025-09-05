import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { useGetReportQuery } from "../../redux/features/reports/reportsApi";
import ShowReportFormContainer from "../../components/reports/forms/ShowReportFormContainer";
import Spinner from "../../components/common/Spinner";
import { NotificationState, NotificationType } from "../../types/common/Notification";
import { useDispatch } from "react-redux";
import { setNotification } from "../../redux/features/notifications/notificationsSlice";

const ReportShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { data: report, error, isLoading } = useGetReportQuery(Number(id));
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const currentQuery = searchParams.get("query") || "";
  const currentPageParam = searchParams.get("page");
  const currentPage = currentPageParam ? parseInt(currentPageParam, 10) : 1;

  useEffect(() => {
    if (error && "data" in error) {
      const apiError = error as { data: { message: string } };
      dispatch(
        setNotification({
          type: NotificationType.ERROR,
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
      <ShowReportFormContainer report={report} errors={errors} />
    </div>
  );
};

export default ReportShowPage;
