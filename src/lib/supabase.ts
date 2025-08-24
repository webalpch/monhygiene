import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gcuacylbpxzhabpflruf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjdWFjeWxicHh6aGFicGZscnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMDA2OTIsImV4cCI6MjA2NzU3NjY5Mn0.Oc9p0_FWkYcRLVrZzWObunP45NQoSy70U-97bJuF5aY';

export const supabase = createClient(supabaseUrl, supabaseKey);