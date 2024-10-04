import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetReportQuery } from '../../redux/features/reports/reportsApi';
import ReportDetails from '../../components/reports/ReportDetails';

const ReportShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: report, error, isLoading } = useGetReportQuery(Number(id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading report</div>;
  }

  if (!report) {
    return <div>No report found</div>;
  }

  return (
    <div>
      <ReportDetails report={report} />
    </div>
  );
};

export default ReportShowPage;
