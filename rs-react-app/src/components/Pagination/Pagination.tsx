import type { ReactNode } from 'react';

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  loading: boolean;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function Pagination({
  totalPages,
  currentPage,
  loading,
  onPageChange,
}: PaginationProps): ReactNode {
  return;
  {
    !loading && (
      <>
        <button onClick={onPageChange}>Previous</button>
        <p>
          {currentPage} / {totalPages}
        </p>
        <button>Next</button>
      </>
    );
  }
}

export default Pagination;
