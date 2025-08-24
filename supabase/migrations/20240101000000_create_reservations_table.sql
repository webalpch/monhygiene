-- Create reservations table
CREATE TABLE IF NOT EXISTS public.reservations (
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

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_reservations_updated_at ON public.reservations;
CREATE TRIGGER update_reservations_updated_at
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function for dashboard stats
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
        COALESCE(SUM(CASE WHEN final_price IS NOT NULL THEN final_price ELSE estimated_price END), 0) as total_revenue,
        COALESCE(SUM(CASE 
            WHEN (final_price IS NOT NULL AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE))
            THEN final_price 
            WHEN (final_price IS NULL AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE))
            THEN estimated_price 
            ELSE 0 
        END), 0) as monthly_revenue,
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

-- Enable Row Level Security
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON public.reservations
    FOR ALL USING (true);

-- Create policy to allow insert for anonymous users (for reservation form)
CREATE POLICY "Allow insert for anonymous users" ON public.reservations
    FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON public.reservations(created_at);
CREATE INDEX IF NOT EXISTS idx_reservations_scheduled_date ON public.reservations(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_client_email ON public.reservations(client_email);