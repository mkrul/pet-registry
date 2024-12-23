import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { useGetReportQuery } from "../../redux/features/reports/reportsApi";
import ShowReportFormContainer from "../../components/reports/ShowReportFormContainer";
import Spinner from "../../components/shared/Spinner";
import { NotificationState, NotificationType } from "../../types/Notification";
import Notification from "../../components/shared/Notification";
import { Errors } from "../../types/ErrorMessages";

const ReportShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const { data: report, error, isLoading } = useGetReportQuery(Number(id));
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const currentQuery = searchParams.get("query") || "";
  const currentPageParam = searchParams.get("page");
  const currentPage = currentPageParam ? parseInt(currentPageParam, 10) : 1;

  useEffect(() => {
    if (error && "data" in error) {
      const apiError = error as { data: { message: string } };
      setNotification({
        type: NotificationType.ERROR,
        message: apiError.data.message || Errors.REPORT_LOAD_FAILED
      });
    }
  }, [error]);

  useEffect(() => {
    if (location.state?.isNewReport) {
      setNotification({
        type: NotificationType.SUCCESS,
        message: location.state.message
      });
    }
  }, [location]);

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
    <div>
      {notification && (
        <div className="container mx-auto p-4 w-full lg:w-[40rem]">
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        </div>
      )}
      <ShowReportFormContainer report={report} errors={errors} />
    </div>
  );
};

export default ReportShowPage;
