import { Component } from 'react';
type CardProps = {
    imageUrl: string;
    name: string;
    films: string[];
    tvShows: string[];
};
declare class Card extends Component<CardProps> {
    render(): import("react/jsx-runtime").JSX.Element;
}
export default Card;
