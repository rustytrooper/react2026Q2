import type { ReactNode } from 'react';
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export declare function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): ReactNode;
export {};
