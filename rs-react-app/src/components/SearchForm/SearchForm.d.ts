import { Component, type ChangeEvent, type SyntheticEvent } from 'react';
export type SearchFormProps = {
    onSearch: (searchTerm: string) => void;
    onSubmit: (searchTerm: string) => void;
    initialValue?: string;
};
type SearchFormState = {
    value: string;
};
declare class SearchForm extends Component<SearchFormProps, SearchFormState> {
    constructor(props: SearchFormProps);
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: SyntheticEvent) => void;
    render(): import("react/jsx-runtime").JSX.Element;
}
export default SearchForm;
