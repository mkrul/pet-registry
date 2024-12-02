import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetReportQuery } from "../../redux/features/reports/reportsApi";
import ShowReportFormContainer from "../../components/reports/ShowReportFormContainer";
import Spinner from "../../components/shared/Spinner";

const ReportShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: report, error, isLoading } = useGetReportQuery(Number(id));
  const [searchParams] = useSearchParams();

  const currentQuery = searchParams.get("query") || "";
  const currentPageParam = searchParams.get("page");
  const currentPage = currentPageParam ? parseInt(currentPageParam, 10) : 1;

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
      <ShowReportFormContainer report={report} errors={errors} />
    </div>
  );
};

export default ReportShowPage;
