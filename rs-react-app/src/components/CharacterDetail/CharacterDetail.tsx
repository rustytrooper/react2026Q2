import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { fetchCharacterById } from '../../helpers/fetchData';
import './characterDetail.css';
import type { Character } from '../../types/charachterType';

export function CharacterDetail(): ReactNode {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    fetchCharacterById(id)
      .then((response) => {
        if (response && response.data) {
          const characterData = response.data as unknown as Character;
          setCharacter(characterData);
        } else {
          setCharacter(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  const handleClose = () => {
    navigate('/' + location.search);
  };

  if (loading) {
    return (
      <div className="character-detail-overlay">
        <div className="character-detail-content">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="character-detail-overlay">
        <div className="character-detail-content">Error loading character</div>
      </div>
    );
  }

  if (!character) {
    return null;
  }

  return (
    <div className="character-detail-overlay">
      <div className="character-detail-content">
        <button className="close-button" onClick={handleClose}>
          ✕
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
          Films: {character.films?.length ? character.films.join(', ') : 'N/A'}
        </p>
        <p>
          TV Shows:{' '}
          {character.tvShows?.length ? character.tvShows.join(', ') : 'N/A'}
        </p>
      </div>
    </div>
  );
}
