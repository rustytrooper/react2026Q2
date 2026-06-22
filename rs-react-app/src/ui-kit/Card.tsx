interface CardProps {
  imageUrl: string;
  name: string;
  films: string[];
  tvShows: string[];
  id: number;
}

// ✅ Серверный компонент (только UI)
 function Card({
  imageUrl,
  name,
  films,
  tvShows,
  
}: CardProps) {
  return (
    <div className="...">
      {/* Вся верстка, но без чекбокса и логики */}
      <div className="flex justify-center ...">
        <img src={imageUrl} alt={name} className="..." />
      </div>
      <div className="p-4 text-center">
        <p className="font-semibold ...">{name}</p>
        <p className="text-gray-600 ...">
          <span className="font-medium">Films:</span> {films.join(', ')}
        </p>
        <p className="text-gray-600 ...">
          <span className="font-medium">TV shows:</span> {tvShows.join(', ')}
        </p>
      </div>
    </div>
  );
}

export  default  Card