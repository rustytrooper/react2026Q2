import React, { useCallback, useMemo } from 'react';
import styles from './year-selector.module.css';

type YearSelectorProps = {
  year: number;
  years: number[];
  onChange: (year: number) => void;
};

export const YearSelector = ({ year, years, onChange }: YearSelectorProps) => {
  const options = useMemo(() => 
    years.map(year => (
      <option key={year} value={year}>
        {year}
      </option>
    )),
    [years] 
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.target.value));
  }, [onChange]);
  
  return (
    <div className={styles.container}>
      <label htmlFor="year" className={styles.label}>
        Select year:
      </label>
      <select
        id="year"
        value={year}
        onChange={handleChange}
        className={styles.select}
      > 
        {options}
      </select>
    </div>
  );
};

