import './App.css';
import SearchForm from './components/SearchForm/SearchForm';
import ResultContainer from './components/ResultCotainer/ResultContainer';
import { fetchData, fetchFilteredData } from './helpers/fetchData';
import { Component } from 'react';
import { type DisneyApiResponse } from './types/charachterType';
import {
  initializeSearchValue,
  saveSearchValue,
  trimValue,
} from './helpers/localStorage';

type AppProps = {};

type AppState = {
  cards: DisneyApiResponse | null;
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
  componentDidMount() {
    this.loadInitialData();
  }

  loadInitialData = async () => {
    const firstSearchValue = initializeSearchValue();
    const cards = await fetchData();
    this.setState({
      cards: cards,
      searchTerm: firstSearchValue,
    });
  };

  handleSearch = async (searchTerm: string) => {
    const trimmedValue = trimValue(searchTerm);
    saveSearchValue(trimmedValue);
    this.setState({ searchTerm: trimmedValue });
  };
  handleSubmit = async (searchTerm: string) => {
    const trimmedValue = trimValue(searchTerm);
    const fetchedFilteredData = await fetchFilteredData(trimmedValue);
    this.setState({ cards: fetchedFilteredData, searchTerm: trimmedValue });
  };

  render() {
    return (
      <>
        <SearchForm
          onSearch={this.handleSearch}
          onSubmit={this.handleSubmit}
          initialValue={this.state.searchTerm}
        />{' '}
        <ResultContainer characters={this.state.cards} />
      </>
    );
  }
}
export default App;
