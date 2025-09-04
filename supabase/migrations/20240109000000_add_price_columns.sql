-- Ajout des colonnes de prix pour les réservations
-- Cette migration ajoute les colonnes nécessaires pour stocker les prix

-- Ajouter la colonne price si elle n'existe pas déjà
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'reservations' AND column_name = 'price') THEN
        ALTER TABLE public.reservations ADD COLUMN price DECIMAL(10,2);
    END IF;
END
$$;

-- Mettre à jour les réservations existantes avec estimated_price si price est null
UPDATE public.reservations 
SET price = estimated_price 
WHERE price IS NULL AND estimated_price IS NOT NULL;

-- Créer un index sur la colonne price pour les performances
CREATE INDEX IF NOT EXISTS idx_reservations_price ON public.reservations(price);

-- Commenter les nouvelles colonnes
COMMENT ON COLUMN public.reservations.price IS 'Prix final de la réservation';