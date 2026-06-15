import { useMemo } from 'react';
import type { YearData } from '../../types';
import { formatNumber } from '../../utils/format-utils';

import styles from './data-table.module.css';

type DataTableProps = {
  data: YearData[];
  year: number;
  columns: string[];
};

export const DataTable = ({ data, year, columns }: DataTableProps) => {
  const yearData = useMemo(() => data.find((item) => item.year === year), [data, year]);

  const tableRows = useMemo(() => {
    if (!yearData) return null;

    return columns.map((column) => {
      const value = yearData[column as keyof YearData];

      const formattedValue = typeof value === 'number' ? formatNumber(value) : (value ?? '-');

      return (
        <tr key={column}>
          <td className={styles.columnLabel}>{column.replace(/_/g, ' ').toUpperCase()}</td>
          <td className={styles.columnValue}>{formattedValue}</td>
        </tr>
      );
    });
  }, [yearData, columns]);

  if (!yearData) {
    return <div className={styles.noData}>No data available for year {year}</div>;
  }

  return (
    <table className={styles.table}>
      <tbody>{tableRows}</tbody>
    </table>
  );
};
