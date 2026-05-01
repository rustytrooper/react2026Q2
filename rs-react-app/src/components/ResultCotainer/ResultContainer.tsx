import { Component } from 'react';
import { type Character } from '../../types/charachterType';
interface ResultContainerProps {
  characters: Character[] | null;
}
class ResultContainer extends Component<ResultContainerProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul>
        {this.props.characters?.map((card) => {
          return (
            <li key={card._id}>
              <img src={card.imageUrl} alt={card.name} />
              <p>Character name: {card.name}</p>
              <p>Character films: {card.films}</p>
              <p>Character TV shows: {card.tvShows}</p>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default ResultContainer;
