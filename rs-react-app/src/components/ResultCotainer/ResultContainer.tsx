'use client'  

import { useRouter, useSearchParams } from 'next/navigation';
import {
  type Character,
  type DisneyApiResponse,
} from '../../types/charachterType';
import ClientCard from '../../ui-kit/ClientCard';


interface ResultContainerProps {
  characters: DisneyApiResponse | null;
}

function ResultContainer({ characters }: ResultContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCardClick = (id: number) => {
    const queryString = searchParams?.toString() || '';
    const url = `/character/${id}${queryString ? `?${queryString}` : ''}`;
    router.push(url);
  };

  return (
    <ul className="grid grid-cols-1 mt-5 mx-auto sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-2">
      {characters?.data.map((card: Character) => (
        <li key={card._id} onClick={() => handleCardClick(card._id)}>
          <ClientCard
            imageUrl={card.imageUrl}
            name={card.name}
            films={card.films}
            tvShows={card.tvShows}
            id={card._id}
          />
        </li>
      ))}
    </ul>
  );
}

export default ResultContainer;