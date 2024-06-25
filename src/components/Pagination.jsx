const Pagination = ({ totalPages, onPageChange,currentPage }) => {
  const current_Page = currentPage;
  const range = (start, end) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const showEllipses = totalPages > 8;

  return (
    <div className='pagination'>
      <button
        className='pagination-btn'
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={current_Page === 1}
      >
        Prev
      </button>

      {showEllipses && current_Page > 4 && (
        <>
          <button className='pagination-btn' onClick={() => onPageChange(1)}>
            1
          </button>
          <span className='pagination-ellipsis'>...</span>
        </>
      )}

      {range(
        Math.max(1, current_Page - 3),
        Math.min(totalPages, current_Page + 4)
      ).map((page) => (
        <button
          key={page}
          className={`pagination-btn ${page === current_Page ? "active" : ""}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {showEllipses && current_Page < totalPages - 3 && (
        <>
          <span className='pagination-ellipsis'>...</span>
          <button
            className='pagination-btn'
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        className='pagination-btn'
        onClick={() => onPageChange(Math.min(current_Page + 1, totalPages))}
        disabled={current_Page === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
