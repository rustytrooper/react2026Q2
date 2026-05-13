import {  useState, type ChangeEvent, type ReactNode, type SyntheticEvent } from 'react';
import {
  initializeSearchValue,
  saveSearchValue,
  trimValue,
} from '../../helpers/localStorage';

export type SearchFormProps = {
  onSearch: (searchTerm: string) => void;
  onSubmit: (searchTerm: string) => void;
  initialValue?: string;
};


function SearchForm ({onSearch,onSubmit,initialValue}: SearchFormProps): ReactNode {
    const savedValue = initializeSearchValue();
  
    const [initValue, setInitValue] = useState(initialValue !== undefined? initialValue: savedValue || '')
  
 const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const changedSearchValue = trimValue(e.target.value);
    saveSearchValue(changedSearchValue);
    onSearch(changedSearchValue);
    setInitValue( changedSearchValue );
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSubmit(initValue);
  };
    return (
      <form
        onSubmit={handleSubmit}
        className="flex justify-between mx-auto mt-6 gap-4"
        data-testid="searchForm"
      >
        <input
          type="text"
          value={initValue}
          onChange={handleChange}
          placeholder="Your search term"
          className="
          w-100
          px-4 
          py-3 
          rounded-2xl 
          bg-white/90 
          border 
          border-gray-300 
          text-gray-800 
          placeholder:text-gray-400 
          focus:outline-none 
          focus:ring-2 
          focus:ring-purple-400 
          focus:border-transparent
          transition-all 
          duration-200
        "
          data-testid="formInput"
        />
        <button
          className="bg-purple-400  rounded-2xl  px-4 py-3 text-white hover:bg-purple-300 cursor-pointer hover:scale-110 transition-all duration-200"
          data-testid="formButton"
        >
          Search
        </button>
      </form>
    ); 
}

export default SearchForm