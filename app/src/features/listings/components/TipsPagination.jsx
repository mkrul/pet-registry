import React from "react";

const TipsPagination = ({ currentPage, totalPages, onPageChange }) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const showFirst = currentPage <= 3;
    const showLast = currentPage >= totalPages - 2;

    if (showFirst) {
      for (let i = 1; i <= 3; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (showLast) {
      for (let i = 1; i <= 3; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2);
      pages.push('ellipsis');
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push('ellipsis');
      pages.push(totalPages - 1, totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center mt-3">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          aria-label="Previous page"
          className={`px-2 py-1 text-sm rounded transition-colors ${
            isFirstPage
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Previous
        </button>
        <div className="flex items-center gap-1 px-2">
          {pageNumbers.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="text-xs text-gray-400 px-1">
                  ...
                </span>
              );
            }
            const isCurrentPage = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={isCurrentPage ? 'page' : undefined}
                className={`min-w-[28px] px-2 py-1 text-sm rounded transition-colors ${
                  isCurrentPage
                    ? "bg-gray-200 text-gray-900 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          aria-label="Next page"
          className={`px-2 py-1 text-sm rounded transition-colors ${
            isLastPage
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TipsPagination;

