import { useState } from "react";

export const usePagination = (onPageChange?: (page: number) => void) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  return { currentPage, handlePageChange };
};
