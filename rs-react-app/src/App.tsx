import './App.css';
import SearchForm from './components/SearchForm/SearchForm';
import ResultContainer from './components/ResultCotainer/ResultContainer';
import { fetchData } from './helpers/fetchData';
import { Component } from 'react';
import { type Character } from './types/charachterType';
import {
  initializeSearchValue,
  saveSearchValue,
  trimValue,
} from './helpers/localStorage';

type AppProps = {};

type AppState = {
  cards: Character[] | null;
  searchTerm: string;
};
class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      cards: null,
      searchTerm: '',
    };
  }
  async componentDidMount(): Promise<void> {
    const firstSearchValue = initializeSearchValue();
    const cards = await fetchData();
    this.setState({ cards: cards.data, searchTerm: firstSearchValue });
  }

  handleSearch = (searchTerm: string) => {
    const trimmedValue = trimValue(searchTerm);
    saveSearchValue(trimmedValue);
    this.setState({ searchTerm: trimmedValue });
  };

  render() {
    return (
      <>
        <SearchForm
          onSearch={this.handleSearch}
          initialValue={this.state.searchTerm}
        />{' '}
        <ResultContainer characters={this.state.cards} />
      </>
    );
  }
}
export default App;
