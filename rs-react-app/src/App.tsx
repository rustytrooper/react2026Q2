import './App.css';
import SearchForm from './components/SearchForm/SearchForm';
import ResultContainer from './components/ResultCotainer/ResultContainer';

function App() {
  return (
    <>
      <SearchForm onSearch={() => {}} />{' '}
      <ResultContainer
        character={[
          {
            id: 1,
            name: 'Larry',
            height: 100,
            locationAreaEncounters: 'Bikini Bottom',
          },
        ]}
      />
    </>
  );
}

export default App;
