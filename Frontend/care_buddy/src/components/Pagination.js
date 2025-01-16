// Pagination.js
import React from 'react';

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    const isTooManyPages = totalPages > 5;
    const startPage = Math.max(currentPage - 2, 1);
    const endPage = Math.min(currentPage + 2, totalPages);

    const visiblePages = isTooManyPages
      ? pageNumbers.slice(startPage - 1, endPage)
      : pageNumbers;

    return (
      <div
        className="pagination"
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '5px',
          marginTop:'20px',
        }}
      >
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          style={{
            border: '1px solid #ddd',
            padding: '0 15px', // Smaller padding
            cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
            borderRadius: '4px',
            // backgroundColor: currentPage > 1 ? '#f0f0f0' : '#e0e0e0',
            opacity: currentPage > 1 ? '1' : '0.5',
          }}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {isTooManyPages && currentPage > 3 && (
          <span style={{ padding: '0 5px' }}>...</span>
        )}

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'tablePageActive' : ''}
            style={{
              border: '1px solid #ddd',
              padding: '0 8px', // Smaller padding
              cursor: 'pointer',
              borderRadius: '4px',
            //   color: currentPage === page ? 'white' : 'black',
            //backgroundColor: currentPage === page ? '#67a97b' : '#f0f0f0',
            }}
          >
            {page}
          </button>
        ))}

        {isTooManyPages && currentPage < totalPages - 2 && (
          <span style={{ padding: '0 5px' }}>...</span>
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          style={{
            border: '1px solid #ddd',
            padding: '0 8px', // Smaller padding
            cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
            borderRadius: '4px',
            // backgroundColor: currentPage < totalPages ? '#f0f0f0' : '#e0e0e0',
            opacity: currentPage < totalPages ? '1' : '0.5',
          }}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return renderPagination();
};

export default Pagination;
