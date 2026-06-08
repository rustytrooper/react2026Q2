import { useState, useRef, useEffect } from 'react';
import { countries, type Country } from '../../../schemas/formSchema';

interface CountryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  id?: string;
  name?: string;
}

export const CountryAutocomplete = ({
  value,
  onChange,
  onBlur,
  error,
  id = 'country',
  name = 'country',
}: CountryAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const [filteredCountries, setFilteredCountries] =
    useState<Country[]>(countries);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    const filtered = countries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm]);

  const handleSelect = (country: Country) => {
    onChange(country.name);
    setSearchTerm(country.name);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        id={id}
        name={name}
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={onBlur}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder="Type to search country..."
        autoComplete="off"
      />

      {isOpen && filteredCountries.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
          {filteredCountries.map((country) => (
            <li
              key={country.code}
              onClick={() => handleSelect(country)}
              className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
            >
              {country.name}
            </li>
          ))}
        </ul>
      )}

      {isOpen && filteredCountries.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-center text-gray-500">
          No countries found
        </div>
      )}
    </div>
  );
};
