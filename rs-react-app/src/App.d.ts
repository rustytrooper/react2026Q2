import './App.css';
import { Component } from 'react';
import { type DisneyApiResponse } from './types/charachterType';
type AppProps = {};
type AppState = {
    cards: DisneyApiResponse | null;
    searchTerm: string;
    loading: boolean;
    error: boolean;
};
declare class App extends Component<AppProps, AppState> {
    constructor(props: AppProps);
    componentDidMount(): void;
    loadInitialData: () => Promise<void>;
    handleSearch: (searchTerm: string) => Promise<void>;
    handleSubmit: (searchTerm: string) => Promise<void>;
    render(): import("react/jsx-runtime").JSX.Element;
}
export default App;
