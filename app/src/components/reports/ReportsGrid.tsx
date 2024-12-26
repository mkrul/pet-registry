import React from "react";
import ReportCard from "./ReportCard";
import { IReport } from "../../types/Report";

interface ReportsGridProps {
  reports: IReport[];
  currentPage: number;
  currentQuery: string;
}

const ReportsGrid: React.FC<ReportsGridProps> = ({ reports, currentPage, currentQuery }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-4">
      {reports.map(report => (
        <ReportCard
          key={report.id}
          report={report}
          currentPage={currentPage}
          currentQuery={currentQuery}
        />
      ))}
    </div>
  );
};

export default ReportsGrid;
