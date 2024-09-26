import React from "react";
import { useGetReportsQuery } from "../../redux/features/reports/reportsApi";
import IReport from "../../types/reports/IReport";
import IPagination from "../../types/shared/IPagination";
import Report from "./Report"; // Make sure you are importing Report component

const ReportsContainer = () => {
  const { data, isFetching, error } = useGetReportsQuery({});

  if (isFetching) return <div>Loading...</div>;
  if (error) return <div>Error loading reports</div>;

  // Provide default empty array if data is undefined
  const reports: IReport[] = data?.data ?? [];

  // Handle undefined pagination by providing a default fallback
  const pagination: IPagination = data?.pagination ?? {
    count: 0,
    items: 0,
    pages: 0,
    page: 0,
  };

  // Using sample data for testing
  const sampleReports = [reports[0], reports[0], reports[0], reports[0]];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sampleReports.map((report: IReport, index: number) => (
        <Report key={index} report={report} />
      ))}
    </div>
  );
};

export default ReportsContainer;
