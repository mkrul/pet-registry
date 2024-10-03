import { useState } from "react";
import { useGetReportsQuery } from "../../redux/features/reports/reportsApi";
import { IReport } from "../../types/reports/Report";
import { IPagination } from "../../types/shared/Pagination";
import ReportCard from "./ReportCard";

const ReportsContainer = ({ query }: { query: string }) => {
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 20;
  const { data, isFetching, error } = useGetReportsQuery({
    page,
    items: itemsPerPage,
    query
  });

  if (isFetching) return <div>Loading...</div>;
  if (error) return <div>Error loading reports</div>;

  const reports: IReport[] = data?.data ?? [];

  const pagination: IPagination = data?.pagination ?? {
    count: 0,
    items: 0,
    pages: 0,
    page: 0,
  };

  const handleNextPage = () => {
    if (page < pagination.pages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md-report:grid-cols-2 lg-report:grid-cols-3 xl-report:grid-cols-3 2xl-report:grid-cols-4 gap-4">
        {reports.map((report: IReport) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>Page {pagination.page} of {pagination.pages}</span>
        <button onClick={handleNextPage} disabled={page === pagination.pages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ReportsContainer;
