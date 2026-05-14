import './App.css';
import SearchForm from './components/SearchForm/SearchForm';
import ResultContainer from './components/ResultCotainer/ResultContainer';
import { fetchData, fetchFilteredData } from './helpers/fetchData';
import {  useEffect, useState, type ReactNode } from 'react';
import { type DisneyApiResponse } from './types/charachterType';
import {
  initializeSearchValue,
  saveSearchValue,
  trimValue,
} from './helpers/localStorage';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { ErrorButton } from './components/ErrorBoundary/ErrorButton';
import { Loader } from './components/Loader/Loader';


function App ( ): ReactNode{
 
  const [cards, setCards] = useState<DisneyApiResponse| null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const loadInitialData = async () => {
    try {
      const savedSearchTerm = initializeSearchValue();
      if (savedSearchTerm && savedSearchTerm.trim() !== '') {
        const filteredCards = await fetchFilteredData(savedSearchTerm);
        setCards(filteredCards)
        setSearchTerm(savedSearchTerm)
        setLoading(false)
        setHasError(false)
      } else {
        const allCards = await fetchData();
        setCards(allCards)
        setSearchTerm('')
        setLoading(false)
      }
    } catch (error) {
      setHasError(true)
      setLoading(false)
      console.error(error);
    }
  };
 
  useEffect(()=> {
    loadInitialData()
  },[])

 

  const handleSearch = async (searchTerm: string) => {
    const trimmedValue = trimValue(searchTerm);
    saveSearchValue(trimmedValue);
    setSearchTerm(trimmedValue)
  };

  const handleSubmit = async (searchTerm: string) => {
    const trimmedValue = trimValue(searchTerm);
    saveSearchValue(trimmedValue);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const fetchedFilteredData = await fetchFilteredData(trimmedValue);
      setCards(fetchedFilteredData)
      setSearchTerm(trimmedValue)
      setHasError(false)
    } catch (error) {
      setHasError( true );
      console.error(error);
    } finally {
      setLoading( false );
    }
  };
  
  return (loading?<Loader /> :  <ErrorBoundary>
        <div className="flex justify-center items-center">
          <SearchForm
            onSearch={handleSearch}
            onSubmit={handleSubmit}
            initialValue={searchTerm}
          />{' '}
        </div>
        <ResultContainer characters={cards} />
        <ErrorButton />
      </ErrorBoundary>)
  
}
export default App;
