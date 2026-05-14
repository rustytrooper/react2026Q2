import { type ReactNode } from 'react';
export type SearchFormProps = {
    onSearch: (searchTerm: string) => void;
    onSubmit: (searchTerm: string) => void;
    initialValue?: string;
};
declare function SearchForm({ onSearch, onSubmit, initialValue }: SearchFormProps): ReactNode;
export default SearchForm;
