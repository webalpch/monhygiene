-- Créer la table admin_schedule dans Supabase
-- Exécutez ce SQL dans l'éditeur SQL de Supabase

CREATE TABLE IF NOT EXISTS admin_schedule (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('morning', 'afternoon')),
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, period)
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_admin_schedule_date_period ON admin_schedule(date, period);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_schedule_updated_at
  BEFORE UPDATE ON admin_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optionnel)
ALTER TABLE admin_schedule ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre toutes les opérations (ajustez selon vos besoins)
CREATE POLICY "Allow all operations on admin_schedule" ON admin_schedule
  FOR ALL USING (true);