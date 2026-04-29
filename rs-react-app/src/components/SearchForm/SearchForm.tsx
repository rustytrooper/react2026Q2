import { Component, type ChangeEvent, type SyntheticEvent } from 'react';

type SearchFormProps = {
  onSearch: (searchTerm: string) => void;
  placeholder?: string;
  initialValue?: string;
};

type SearchFormState = {
  value: string;
};

class SearchForm extends Component<SearchFormProps, SearchFormState> {
  constructor(props) {
    super(props);
    this.state = { value: this.props.initialValue || '' };
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({ value: e.target.value });
  };

  handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    this.props.onSearch(this.state.value);
  };

  render() {
    const { placeholder = 'Your search term' } = this.props;
    const { value } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={this.handleChange}
          placeholder={placeholder}
        />
        <button>Search</button>
      </form>
    );
  }
}

export default SearchForm;
