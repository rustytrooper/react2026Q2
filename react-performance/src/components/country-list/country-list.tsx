import type { Country } from '../../types';
import { CountryCard } from '../country-card/country-card';
import { createYearDataMap } from '../../utils/data-transformers';
import { List, type RowComponentProps } from 'react-window';

import styles from './country-list.module.css';
import React, { useCallback, useMemo } from 'react';

type CountryListProps = {
  countries: Country[];
  searchQuery: string;
  selectedColumns: string[];
  selectedRegion: string;
  selectedYear: number;
  sortField: 'name' | 'population';
  sortOrder: 'asc' | 'desc';
  onYearChange: (year: number) => void;
};

export const CountryList = React.memo(
  ({
    countries,
    searchQuery,
    selectedColumns,
    selectedRegion,
    selectedYear,
    sortField,
    sortOrder,
  }: CountryListProps) => {
    const countriesWithCache = useMemo(() => {
      return countries.map((country) => {
        const yearDataMap = createYearDataMap(country.data);
        const populationsByYear = new Map<number, number>();
        const co2ByYear = new Map<number, number>();

        country.data.forEach((item) => {
          populationsByYear.set(item.year, item.population || 0);
        });

        return {
          ...country,
          _cache: {
            yearDataMap,
            populationsByYear,
            co2ByYear,
          },
        };
      });
    }, [countries]);

    const filteredCountries = useMemo(() => {
      return countriesWithCache
        .filter((c) => {
          const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesRegion = !selectedRegion || c.data.some((d) => d.region === selectedRegion);
          return matchesSearch && matchesRegion;
        })
        .sort((a, b) => {
          if (sortField === 'name') {
            return sortOrder === 'asc' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
          } else {
            const popA = a._cache.yearDataMap.get(selectedYear)?.population || 0;
            const popB = b._cache.yearDataMap.get(selectedYear)?.population || 0;
            return sortOrder === 'asc' ? popA - popB : popB - popA;
          }
        });
    }, [countriesWithCache, searchQuery, selectedRegion, selectedYear, sortField, sortOrder]);

    const RowComponent = useCallback(
      ({ index, style }: RowComponentProps) => {
        const country = filteredCountries[index];
        if (!country) return null;

        return (
          <div style={style}>
            <CountryCard
              country={country}
              selectedYear={selectedYear}
              selectedColumns={selectedColumns}
            />
          </div>
        );
      },
      [filteredCountries, selectedYear, selectedColumns]
    );

    const rowPropsData = useMemo(
      () => ({
        countries: filteredCountries,
        selectedYear: selectedYear,
        selectedColumns: selectedColumns,
      }),
      [filteredCountries, selectedYear, selectedColumns]
    );

    if (filteredCountries.length < 50) {
      return (
        <div className={styles.countryList}>
          {filteredCountries.map((country) => (
            <CountryCard
              key={country.id}
              country={country}
              selectedYear={selectedYear}
              selectedColumns={selectedColumns}
            />
          ))}
        </div>
      );
    }

    return (
      <List
        rowComponent={RowComponent}
        rowCount={filteredCountries.length}
        rowHeight={120}
        rowProps={rowPropsData}
        className={styles.virtualizedList}
        style={{ height: '70vh', width: '100%' }}
      />
    );
  }
);
