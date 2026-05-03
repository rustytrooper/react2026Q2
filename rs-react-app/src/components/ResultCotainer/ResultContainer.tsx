import { Component } from 'react';
import { type DisneyApiResponse } from '../../types/charachterType';
import Card from '../../ui-kit/Card';
interface ResultContainerProps {
  characters: DisneyApiResponse | null;
}
class ResultContainer extends Component<ResultContainerProps> {
  constructor(props: ResultContainerProps) {
    super(props);
  }

  render() {
    return (
      <ul className="grid grid-cols-1 mt-5  mx-auto  sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-2">
        {this.props.characters?.data.map((card) => {
          return (
            <li key={card._id}>
              <Card
                imageUrl={card.imageUrl}
                name={card.name}
                films={card.films}
                tvShows={card.tvShows}
              />
            </li>
          );
        })}
      </ul>
    );
  }
}

export default ResultContainer;
