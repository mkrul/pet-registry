import React from "react";
import ReportCard from "./ReportCard";
import Pagination from "../../../../shared/components/common/Pagination";
import { ReportsGridProps } from "../../types/Report";

const ReportsGrid:  = ({
  reports,
  currentPage,
  currentQuery,
  pagination,
  onPageChange
}) => {
  return (
    <div>
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
      {pagination && pagination.pages > 1 && onPageChange && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ReportsGrid;
