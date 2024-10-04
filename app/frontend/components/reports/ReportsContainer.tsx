import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setSearchQuery, setReports } from "../../redux/features/reports/reportsSlice";
import { useGetReportsQuery } from "../../redux/features/reports/reportsApi";
import ReportCard from "./ReportCard";

const ReportsContainer = () => {
  const dispatch = useDispatch();
  const query = useSelector((state: RootState) => state.reports.query); // Get the query from Redux
  const reports = useSelector((state: RootState) => state.reports.data); // Get reports from Redux
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 20;

  const { data, isFetching, error } = useGetReportsQuery({
    page,
    items: itemsPerPage,
    query,
  });

  useEffect(() => {
    if (data && data.data) {
      dispatch(setReports(data.data)); // Store the fetched reports in Redux
    }
  }, [data, dispatch]);

  const handleNextPage = () => {
    if (page < data?.pagination.pages) {
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
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>Page {data?.pagination.page} of {data?.pagination.pages}</span>
        <button onClick={handleNextPage} disabled={page === data?.pagination.pages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ReportsContainer;
