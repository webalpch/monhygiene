import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ReservationDe = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Rediriger vers l'accueil allemand avec un paramètre pour ouvrir le modal
    navigate('/de?reservation=true');
  }, [navigate]);

  return null;
};

export default ReservationDe;