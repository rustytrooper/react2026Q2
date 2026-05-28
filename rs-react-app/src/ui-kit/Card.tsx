import useDisneyStore from '../store/useDownloadData';

type CardProps = {
  imageUrl: string;
  name: string;
  films: string[];
  tvShows: string[];
  id: number;
};

function Card({ imageUrl, name, films, tvShows, id }: CardProps) {
  const selectCharacter = useDisneyStore((state) => state.selectCharacter);
  const isSelected = useDisneyStore((state) => state.selectedIds.has(id));

  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    selectCharacter(id);
  };
  return (
    <div
      className="
        w-full 
        h-100
        max-w-[280px] 
        sm:max-w-[300px] 
        md:max-w-none 
        md:w-72 
        lg:w-80
        rounded-2xl 
        bg-white 
        shadow-md 
        hover:shadow-lg 
        transition-all 
        duration-300 
        border 
        border-gray-100
        dark:bg-purple-800
        dark:border-purple-700
      dark:shadow-purple-500
      "
    >
      <input
        type="checkbox"
        checked={isSelected}
        onClick={handleCheckboxClick}
        className="
          accent-white
          checked:accent-purple-400
          w-5 
          h-5
          mt-2
          cursor-pointer
          ml-60
          dark:bg-white
        "
      />
      <div
        className="
          flex 
          justify-center 
          w-11/12 
          max-w-[240px] 
          aspect-square 
          mx-auto 
          mt-4 
          overflow-hidden 
          rounded-xl 
          cursor-pointer
        "
      >
        <img
          src={imageUrl}
          alt={name}
          className="
              w-full 
              h-full 
              object-cover 
              transition-transform 
              duration-300 
              hover:scale-110
            "
        />
      </div>

      <div className="p-4 text-center">
        <p className="font-semibold text-gray-800 text-base sm:text-lg dark:text-white transition-all duration-300">
          {name}
        </p>

        <p className="text-gray-600 text-xs sm:text-sm mt-2 line-clamp-2 dark:text-white transition-all duration-300">
          <span className="font-medium">Films:</span> {films.join(', ')}
        </p>

        <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2 dark:text-white transition-all duration-300">
          <span className="font-medium">TV shows:</span> {tvShows.join(', ')}
        </p>
      </div>
    </div>
  );
}

export default Card;
