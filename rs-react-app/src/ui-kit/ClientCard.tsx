// ui-kit/Card/CardWithSelection.tsx (клиентский, с логикой)
'use client'

import useDisneyStore from "../store/useDownloadData";
import Card from "./Card";

// import { Card } from './Card'
// import useDisneyStore from '../../store/useDownloadData'

interface ClientCardProps {
  imageUrl: string;
  name: string;
  films: string[];
  tvShows: string[];
  id: number;
}

// ✅ Клиентский компонент (добавляет логику выбора)
 function ClientCard({
  imageUrl,
  name,
  films,
  tvShows,
  id,
}: ClientCardProps) {
  const selectCharacter = useDisneyStore((state) => state.selectCharacter);
  const isSelected = useDisneyStore((state) => state.selectedIds.has(id));

  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    selectCharacter(id);
  };

  return (
    <div className="relative">
      <input
        type="checkbox"
        checked={isSelected}
        onClick={handleCheckboxClick}
        className="absolute top-2 right-2 w-5 h-5 cursor-pointer"
      />
      <Card
        imageUrl={imageUrl}
        name={name}
        films={films}
        tvShows={tvShows}
        id={id}
      />
    </div>
  );
}

export default ClientCard