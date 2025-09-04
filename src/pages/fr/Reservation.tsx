import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReservationFr = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers l'accueil français avec un paramètre pour ouvrir le modal
    navigate('/fr?reservation=true');
  }, [navigate]);

  return null;
};

export default ReservationFr;