import React from "react";
import { useGetReportsQuery } from "../../redux/features/reports/reportsApi";
import IReport from "../../types/reports/Report";
import IPagination from "../../types/shared/Pagination";
import Report from "./Report";

const ReportsContainer = () => {
  const { data, isFetching, error } = useGetReportsQuery({});

  if (isFetching) return <div>Loading...</div>;
  if (error) return <div>Error loading reports</div>;

  const reports: IReport[] = data?.data ?? [];

  const pagination: IPagination = data?.pagination ?? {
    count: 0,
    items: 0,
    pages: 0,
    page: 0,
  };

  return (
    <div className="grid grid-cols-1 md-report:grid-cols-2 lg-report:grid-cols-3 xl-report:grid-cols-3 2xl-report:grid-cols-4 gap-4">
      {reports.map((report: IReport, index: number) => (
        <div className="h-full">
          <Report key={index} report={report} />
        </div>
      ))}
    </div>
  );

};

export default ReportsContainer;
