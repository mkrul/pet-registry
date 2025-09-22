import { useState } from "react";

export const usePagination = (onPageChange) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  return { currentPage, handlePageChange };
};
