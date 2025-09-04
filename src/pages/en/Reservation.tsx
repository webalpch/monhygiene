import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReservationEn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers l'accueil anglais avec un paramètre pour ouvrir le modal
    navigate('/en?reservation=true');
  }, [navigate]);

  return null;
};

export default ReservationEn;