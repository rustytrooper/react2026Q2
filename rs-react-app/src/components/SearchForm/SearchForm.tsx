import { Component, type ChangeEvent, type SyntheticEvent } from 'react';
import { saveSearchValue, trimValue } from '../../helpers/localStorage';

type SearchFormProps = {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
};

type SearchFormState = {
  value: string;
};

class SearchForm extends Component<SearchFormProps, SearchFormState> {
  constructor(props) {
    super(props);
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const changedSearchValue = trimValue(e.target.value);
    saveSearchValue(changedSearchValue);
    this.props.onSearch(changedSearchValue);
    this.setState({ value: changedSearchValue });
  };

  handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  render() {
    const { initialValue } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={initialValue}
          onChange={this.handleChange}
          placeholder="Your search term"
        />
        <button>Search</button>
      </form>
    );
  }
}

export default SearchForm;
