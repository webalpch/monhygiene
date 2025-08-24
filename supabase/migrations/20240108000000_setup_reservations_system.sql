-- Migration complète pour le système de réservations
-- Supprime et recrée tout proprement

-- 1. Supprimer les policies existantes
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.reservations;
DROP POLICY IF EXISTS "Allow insert for anonymous users" ON public.reservations;

-- 2. Supprimer les triggers existants
DROP TRIGGER IF EXISTS update_reservations_updated_at ON public.reservations;

-- 3. Supprimer les fonctions existantes
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS get_dashboard_stats();

-- 4. Supprimer les index existants
DROP INDEX IF EXISTS idx_reservations_created_at;
DROP INDEX IF EXISTS idx_reservations_scheduled_date;
DROP INDEX IF EXISTS idx_reservations_status;
DROP INDEX IF EXISTS idx_reservations_client_email;

-- 5. Supprimer la table si elle existe
DROP TABLE IF EXISTS public.reservations;

-- 6. Créer la table reservations
CREATE TABLE public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Informations client
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    
    -- Adresse
    address TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT '',
    postcode TEXT NOT NULL DEFAULT '',
    coordinates FLOAT8[2], -- Array de deux coordonnées [longitude, latitude]
    
    -- Service
    service_type TEXT NOT NULL,
    service_details JSONB NOT NULL DEFAULT '{}',
    
    -- Planification
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    
    -- Statut
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    
    -- Financier
    estimated_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    final_price DECIMAL(10,2),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    
    -- Notes
    notes TEXT,
    internal_notes TEXT
);

-- 7. Créer la fonction pour updated_at
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Créer le trigger
CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Recalculer les stats pour inclure les vrais prix
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
    total_reservations BIGINT,
    total_revenue DECIMAL,
    monthly_revenue DECIMAL,
    pending_reservations BIGINT,
    completed_reservations BIGINT,
    cancellation_rate DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_reservations,
        -- Chiffre d'affaires total : uniquement les rendez-vous passés ou complétés
        COALESCE(SUM(
            CASE 
                WHEN (scheduled_date < CURRENT_DATE OR status = 'completed') THEN
                    CASE 
                        WHEN price IS NOT NULL AND price > 0 THEN price
                        WHEN final_price IS NOT NULL AND final_price > 0 THEN final_price 
                        WHEN estimated_price IS NOT NULL AND estimated_price > 0 THEN estimated_price
                        WHEN service_details->'subThemes'->>'price' IS NOT NULL 
                        THEN CAST(service_details->'subThemes'->>'price' AS decimal)
                        ELSE 0 
                    END
                ELSE 0
            END
        ), 0) as total_revenue,
        -- Chiffre d'affaires mensuel : uniquement les rendez-vous passés ou complétés de ce mois
        COALESCE(SUM(
            CASE 
                WHEN DATE_TRUNC('month', scheduled_date) = DATE_TRUNC('month', CURRENT_DATE) 
                     AND (scheduled_date < CURRENT_DATE OR status = 'completed') THEN
                    CASE 
                        WHEN price IS NOT NULL AND price > 0 THEN price
                        WHEN final_price IS NOT NULL AND final_price > 0 THEN final_price 
                        WHEN estimated_price IS NOT NULL AND estimated_price > 0 THEN estimated_price
                        WHEN service_details->'subThemes'->>'price' IS NOT NULL 
                        THEN CAST(service_details->'subThemes'->>'price' AS decimal)
                        ELSE 0 
                    END
                ELSE 0 
            END
        ), 0) as monthly_revenue,
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::BIGINT as pending_reservations,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::BIGINT as completed_reservations,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND(COUNT(CASE WHEN status = 'cancelled' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL, 3)
            ELSE 0 
        END as cancellation_rate
    FROM public.reservations;
END;
$$ LANGUAGE plpgsql;

-- 10. Activer RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- 11. Créer les policies
CREATE POLICY "Allow all operations for authenticated users" ON public.reservations
    FOR ALL USING (true);

CREATE POLICY "Allow insert for anonymous users" ON public.reservations
    FOR INSERT WITH CHECK (true);

-- 12. Créer les index pour les performances
CREATE INDEX idx_reservations_created_at ON public.reservations(created_at);
CREATE INDEX idx_reservations_scheduled_date ON public.reservations(scheduled_date);
CREATE INDEX idx_reservations_status ON public.reservations(status);
CREATE INDEX idx_reservations_client_email ON public.reservations(client_email);

-- 13. Commenter la table
COMMENT ON TABLE public.reservations IS 'Table des réservations avec toutes les informations client, service et planification';