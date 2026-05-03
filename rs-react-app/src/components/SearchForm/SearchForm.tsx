import { Component, type ChangeEvent, type SyntheticEvent } from 'react';
import { saveSearchValue, trimValue } from '../../helpers/localStorage';

type SearchFormProps = {
  onSearch: (searchTerm: string) => void;
  onSubmit: (searchTerm: string) => void;
  initialValue?: string;
};

type SearchFormState = {
  value: string;
};

class SearchForm extends Component<SearchFormProps, SearchFormState> {
  constructor(props: SearchFormProps) {
    super(props);
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const changedSearchValue = trimValue(e.target.value);
    saveSearchValue(changedSearchValue);
    this.props.onSearch(changedSearchValue);
    this.setState({ value: changedSearchValue });
  };

  handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    this.props.onSubmit(this.state.value);
  };

  render() {
    const { initialValue } = this.props;

    return (
      <form
        onSubmit={this.handleSubmit}
        className="flex justify-between mx-auto mt-6 gap-4"
      >
        <input
          type="text"
          value={initialValue}
          onChange={this.handleChange}
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
        />
        <button className="bg-purple-400  rounded-2xl  px-4 py-3 text-white hover:bg-purple-300 cursor-pointer hover:scale-110 transition-all duration-200">
          Search
        </button>
      </form>
    );
  }
}

export default SearchForm;
