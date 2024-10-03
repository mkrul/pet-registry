import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetReportQuery } from '../../redux/features/reports/reportsApi';
import { IReport } from '../../types/reports/Report';
import ReportDetails from '../../components/reports/ReportDetails';

const ReportShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: report, error, isLoading } = useGetReportQuery(Number(id)) as { data: IReport, error: any, isLoading: boolean };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading report</div>;
  }

  return (
    <div>
      {report && (
        <ReportDetails report={report} />
      )}
    </div>
  );
};

export default ReportShowPage;
