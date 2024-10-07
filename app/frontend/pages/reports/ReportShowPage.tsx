import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetReportQuery } from '../../redux/features/reports/reportsApi';
import ReportDetailsContainer from '../../components/reports/ReportDetailsContainer';

const ReportShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: report, error, isLoading } = useGetReportQuery(Number(id));

  const errors = error ? [error.toString()] : [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!report) {
    return <div>No report found</div>;
  }

  return (
    <div>
      <ReportDetailsContainer report={report} errors={errors} />
    </div>
  );
};

export default ReportShowPage;
