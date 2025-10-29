import React from "react";
import ReportCard from "./ListingCard.jsx";
import Pagination from "../../../shared/components/common/Pagination.jsx";

const ListingsGrid = ({
  reports,
  currentPage,
  currentQuery,
  pagination,
  onPageChange
}) => {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
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

export default ListingsGrid;
