import React from "react";
import ReportCard from "./ListingCard.jsx";
import PaginationControls from "../../../shared/components/common/PaginationControls.jsx";

const ListingsGrid = ({
  reports,
  currentPage,
  currentQuery,
  pagination,
  onPageChange
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 2xl:grid-cols-5 gap-4">
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
        <div className="mt-4 flex justify-center">
          <PaginationControls
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ListingsGrid;
