
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Reservation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers l'accueil avec un paramètre pour ouvrir le modal
    navigate('/?reservation=true');
  }, [navigate]);

  return null;
};

export default Reservation;
