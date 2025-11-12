import React from "react";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const isFirstPage = safeCurrentPage === 1;
  const isLastPage = safeCurrentPage === totalPages;

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const nearStart = safeCurrentPage <= 4;
    const nearEnd = safeCurrentPage >= totalPages - 3;

    if (nearStart) {
      for (let i = 1; i <= 4; i += 1) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages - 1, totalPages);
      return pages;
    }

    if (nearEnd) {
      pages.push(1, 2);
      pages.push("ellipsis");
      for (let i = totalPages - 3; i <= totalPages; i += 1) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1, 2);
    pages.push("ellipsis");
    pages.push(safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1);
    pages.push("ellipsis");
    pages.push(totalPages - 1, totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex justify-center items-center" role="navigation" aria-label="Pagination">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage - 1)}
          disabled={isFirstPage}
          aria-label="Previous page"
          className={`px-2 py-1 text-sm rounded transition-colors ${
            isFirstPage
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Previous
        </button>
        <div className="flex items-center gap-1 px-2">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span key={`ellipsis-${index}`} className="text-xs text-gray-400 px-1 dark:text-gray-500">
                  ...
                </span>
              );
            }

            const isCurrentPage = page === safeCurrentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={isCurrentPage ? "page" : undefined}
                className={`min-w-[28px] px-2 py-1 text-sm rounded transition-colors ${
                  isCurrentPage
                    ? "bg-gray-200 text-gray-900 font-medium dark:bg-gray-700 dark:text-gray-100"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => onPageChange(safeCurrentPage + 1)}
          disabled={isLastPage}
          aria-label="Next page"
          className={`px-2 py-1 text-sm rounded transition-colors ${
            isLastPage
              ? "text-gray-400 cursor-not-allowed dark:text-gray-500"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default PaginationControls;

