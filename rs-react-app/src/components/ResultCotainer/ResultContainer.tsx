import {
  type Character,
  type DisneyApiResponse,
} from '../../types/charachterType';
import Card from '../../ui-kit/Card';
interface ResultContainerProps {
  characters: DisneyApiResponse | null;
}

function ResultContainer({ characters }: ResultContainerProps) {
  return (
    <ul className="grid grid-cols-1 mt-5  mx-auto  sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-2">
      {characters?.data.map((card: Character) => {
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

export default ResultContainer;
