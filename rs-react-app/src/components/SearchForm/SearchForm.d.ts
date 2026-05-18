import { type ReactNode } from 'react';
export type SearchFormProps = {
  onSubmit: (searchTerm: string) => void;
  initialValue?: string;
};
declare function SearchForm({
  onSubmit,
  initialValue,
}: SearchFormProps): ReactNode;
export default SearchForm;
