import { Component } from 'react';
import { type Character } from '../../types/charachterType';

type ResultContainerProps = {
  character: Character[];
};

class ResultContainer extends Component<ResultContainerProps> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul>
        {this.props.character.map((card) => {
          return (
            <li>
              <p>Character id: {card.id}</p>
              <p>Character name: {card.name}</p>
              <p>Character height: {card.height}</p>
              <p>Character home: {card.locationAreaEncounters}</p>
            </li>
          );
        })}
      </ul>
    );
  }
}

export default ResultContainer;
