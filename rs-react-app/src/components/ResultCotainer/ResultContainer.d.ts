import { Component } from 'react';
import { type DisneyApiResponse } from '../../types/charachterType';
interface ResultContainerProps {
    characters: DisneyApiResponse | null;
}
declare class ResultContainer extends Component<ResultContainerProps> {
    constructor(props: ResultContainerProps);
    render(): import("react/jsx-runtime").JSX.Element;
}
export default ResultContainer;
