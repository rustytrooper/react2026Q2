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
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { ErrorButton } from './components/ErrorBoundary/ErrorButton';
import { Loader } from './components/Loader/Loader';

type AppProps = {};

type AppState = {
  cards: DisneyApiResponse | null;
  searchTerm: string;
  loading: boolean;
  error: boolean;
};
class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      cards: null,
      searchTerm: '',
      loading: true,
      error: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.loadInitialData();
  }

  loadInitialData = async () => {
    try {
      const savedSearchTerm = initializeSearchValue();
      if (savedSearchTerm && savedSearchTerm.trim() !== '') {
        const filteredCards = await fetchFilteredData(savedSearchTerm);
        this.setState({
          cards: filteredCards,
          searchTerm: savedSearchTerm,
          loading: false,
          error: false,
        });
      } else {
        const allCards = await fetchData();
        this.setState({
          cards: allCards,
          searchTerm: '',
          loading: false,
        });
      }
    } catch (error) {
      this.setState({ error: true, loading: false });
      console.error(error);
    }
  };

  handleSearch = async (searchTerm: string) => {
    const trimmedValue = trimValue(searchTerm);
    saveSearchValue(trimmedValue);
    this.setState({ searchTerm: trimmedValue });
  };

  handleSubmit = async (searchTerm: string) => {
    const trimmedValue = trimValue(searchTerm);
    saveSearchValue(trimmedValue);
    try {
      this.setState({ loading: true });
      await new Promise((resolve) => setTimeout(resolve, 800));
      const fetchedFilteredData = await fetchFilteredData(trimmedValue);
      this.setState({
        cards: fetchedFilteredData,
        searchTerm: trimmedValue,
        error: false,
      });
    } catch (error) {
      this.setState({ error: true });
      console.error(error);
    } finally {
      this.setState({ loading: false });
    }
  };
  render() {
    const { loading } = this.state;
    if (loading) {
      return <Loader />;
    }
    return (
      <ErrorBoundary>
        <div className="flex justify-center items-center">
          <SearchForm
            onSearch={this.handleSearch}
            onSubmit={this.handleSubmit}
            initialValue={this.state.searchTerm}
          />{' '}
        </div>
        <ResultContainer characters={this.state.cards} />
        <ErrorButton />
      </ErrorBoundary>
    );
  }
}
export default App;
