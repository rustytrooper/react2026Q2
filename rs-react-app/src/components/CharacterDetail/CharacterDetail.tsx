import { useEffect, useState, type ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { fetchData } from '../../helpers/fetchData';
import './characterDetail.css'

export function CharacterDetail(): ReactNode {
   const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    // if (id) {
    //   fetchData(id).then(data => setCharacter(data));
    // }
  }, [id]);

  const handleClose = () => {
    navigate('/' + location.search);
  };
  
  return (
    <>
    
     <div className="character-detail-overlay">
      <div className="character-detail-content">
        <button className="close-button" onClick={handleClose}>X</button>
        <h1>CHARACTER!</h1>
       
      </div>
    </div>
    </>
  );
}
