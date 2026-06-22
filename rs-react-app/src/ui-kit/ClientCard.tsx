'use client'

import useDisneyStore from "../store/useDownloadData";
import Card from "./Card";


interface ClientCardProps {
  imageUrl: string;
  name: string;
  films: string[];
  tvShows: string[];
  id: number;
}

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
    <div >
      <input
        type="checkbox"
        checked={isSelected}
        onClick={handleCheckboxClick}
        className="
        
          accent-white
          checked:accent-purple-400
          w-5 
          h-5
          mt-5
          cursor-pointer
          ml-60
          dark:bg-white
        "
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