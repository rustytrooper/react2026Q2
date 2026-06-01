import { useNavigate, useParams } from 'react-router';
import './characterDetail.css';
import { useCharacterDetail } from '../../hooks/useFetchCharacters/useCharactersDetail';

export function CharacterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: character,
    isLoading,
    isRefetching,
    error,
    refetch,
  } = useCharacterDetail(id);

  const handleClose = () => navigate('/' + location.search);

  const handleRefresh = () => refetch();

  if (error)
    return (
      <div className="detail-overlay">
        <p>Error: {error.message}</p>
        <button onClick={handleRefresh}>Try Again</button>
      </div>
    );
  if (!character) return null;

  return (
    <div className="character-detail-overlay">
      <div className="character-detail-content">
        <button className="close-button" onClick={handleClose}>
          ✕
        </button>
        {isRefetching ? (
          <div className="detail-overlay py-40">Refreshing...</div>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {' '}
            <button
              className="bg-purple-400 
              rounded-xl  
              px-2 
              py-1 
              text-white
              hover:bg-purple-300 
              cursor-pointer 
              hover:scale-105 
              dark:bg-purple-950 
              dark:hover:bg-purple-800 
              transition-all 
              duration-100"
              onClick={handleRefresh}
            >
              🔄 Refresh
            </button>
            <p className="text-xl">{character.name || 'CHARACTER!'}</p>
            {character.imageUrl && (
              <img
                className="rounded-xl object-cover w-50 h-50 mx-auto my-4"
                src={character.imageUrl}
                alt={character.name}
              />
            )}
            <p>
              Films:{' '}
              {character.films?.length ? character.films.join(', ') : 'N/A'}
            </p>
            <p>
              TV Shows:{' '}
              {character.tvShows?.length ? character.tvShows.join(', ') : 'N/A'}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
