-- Mise à jour des prix existants depuis service_details
-- Cette migration corrige les prix qui sont à 0 en utilisant les données de service_details

-- Mettre à jour les prix depuis service_details.subThemes.price
UPDATE public.reservations 
SET 
  price = CAST(service_details->'subThemes'->>'price' AS decimal),
  estimated_price = CAST(service_details->'subThemes'->>'price' AS decimal)
WHERE 
  (price = 0 OR price IS NULL OR estimated_price = 0) 
  AND service_details->'subThemes'->>'price' IS NOT NULL 
  AND service_details->'subThemes'->>'price' != '';

-- Mettre à jour estimated_price pour les réservations sans prix mais avec subThemes
UPDATE public.reservations 
SET estimated_price = 150
WHERE estimated_price = 0 AND service_type = 'nettoyage-vehicule';

UPDATE public.reservations 
SET estimated_price = 120
WHERE estimated_price = 0 AND service_type = 'nettoyage-canape';

UPDATE public.reservations 
SET estimated_price = 100
WHERE estimated_price = 0 AND service_type = 'nettoyage-matelas';

-- Log pour vérifier les mises à jour
SELECT 
  client_name, 
  service_type, 
  estimated_price, 
  price, 
  service_details->'subThemes'->>'price' as subtheme_price
FROM public.reservations;