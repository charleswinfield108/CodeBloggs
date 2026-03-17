import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) => {
  const pageNumbers = [];
  const maxPagesToShow = 5;

  // Calculate which pages to show
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "1.5rem",
        paddingTop: "1rem",
        borderTop: "1px solid #E0E0E0",
      }}
    >
      {/* Items Per Page Dropdown */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <label htmlFor="itemsPerPage" style={{ color: "#1F2340", fontSize: "0.875rem", fontWeight: "600" }}>
          Results Per Page:
        </label>
        <select
          id="itemsPerPage"
          name="itemsPerPage"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          style={{
            padding: "0.5rem",
            border: "1px solid #E0E0E0",
            borderRadius: "6px",
            fontSize: "0.875rem",
            cursor: "pointer",
            backgroundColor: "#FFFFFF",
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={25}>25</option>
        </select>
      </div>

      {/* Pagination Controls */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: "0.5rem 0.75rem",
            border: "1px solid #E0E0E0",
            borderRadius: "6px",
            backgroundColor: currentPage === 1 ? "#F5F5F5" : "#FFFFFF",
            color: currentPage === 1 ? "#999" : "#1F2340",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
            fontWeight: "600",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = "#F0F0F5";
              e.currentTarget.style.borderColor = "#8D88EA";
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== 1) {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.borderColor = "#E0E0E0";
            }
          }}
        >
          ← Previous
        </button>

        {/* Page Numbers */}
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              style={{
                padding: "0.5rem 0.75rem",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                color: "#1F2340",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              1
            </button>
            {startPage > 2 && <span style={{ color: "#999" }}>...</span>}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              padding: "0.5rem 0.75rem",
              border: "1px solid #E0E0E0",
              borderRadius: "6px",
              backgroundColor: page === currentPage ? "#8D88EA" : "#FFFFFF",
              color: page === currentPage ? "#FFFFFF" : "#1F2340",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (page !== currentPage) {
                e.currentTarget.style.backgroundColor = "#F0F0F5";
                e.currentTarget.style.borderColor = "#8D88EA";
              }
            }}
            onMouseLeave={(e) => {
              if (page !== currentPage) {
                e.currentTarget.style.backgroundColor = "#FFFFFF";
                e.currentTarget.style.borderColor = "#E0E0E0";
              }
            }}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span style={{ color: "#999" }}>...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              style={{
                padding: "0.5rem 0.75rem",
                border: "1px solid #E0E0E0",
                borderRadius: "6px",
                backgroundColor: "#FFFFFF",
                color: "#1F2340",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "0.5rem 0.75rem",
            border: "1px solid #E0E0E0",
            borderRadius: "6px",
            backgroundColor: currentPage === totalPages ? "#F5F5F5" : "#FFFFFF",
            color: currentPage === totalPages ? "#999" : "#1F2340",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            fontSize: "0.875rem",
            fontWeight: "600",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = "#F0F0F5";
              e.currentTarget.style.borderColor = "#8D88EA";
            }
          }}
          onMouseLeave={(e) => {
            if (currentPage !== totalPages) {
              e.currentTarget.style.backgroundColor = "#FFFFFF";
              e.currentTarget.style.borderColor = "#E0E0E0";
            }
          }}
        >
          Next →
        </button>
      </div>

      {/* Page Info */}
      <div style={{ color: "#666", fontSize: "0.875rem", fontWeight: "600" }}>
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default Pagination;
