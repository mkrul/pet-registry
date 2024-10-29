import React from "react";
import { useParams } from "react-router-dom";
import { useGetReportQuery } from "../../redux/features/reports/reportsApi";
import EditReportFormContainer from "../../components/reports/EditReportFormContainer";

const ReportShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: report, error, isLoading } = useGetReportQuery(Number(id));

  const errors = error ? [error.toString()] : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!report) {
    return <div>No report found</div>;
  }

  return (
    <div>
      <EditReportFormContainer report={report} errors={errors} />
    </div>
  );
};

export default ReportShowPage;
