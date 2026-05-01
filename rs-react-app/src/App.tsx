import './App.css';
import SearchForm from './components/SearchForm/SearchForm';
import ResultContainer from './components/ResultCotainer/ResultContainer';
import { fetchData } from './helpers/fetchData';
import { Component } from 'react';
import { type Character } from './types/charachterType';
import { initializeSearchValue } from './helpers/localStorage';

type AppProps = {};

type AppState = {
  cards: Character[] | null;
};
class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      cards: null,
    };
  }
  async componentDidMount(): Promise<void> {
    const cards = await fetchData();
    this.setState({ cards: cards.data });
  }
  render() {
    return (
      <>
        <SearchForm onSearch={() => {}} />{' '}
        <ResultContainer characters={this.state.cards} />
      </>
    );
  }
}
export default App;
