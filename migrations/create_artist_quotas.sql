-- Create artist_quotas table for PostgreSQL/Supabase
CREATE TABLE IF NOT EXISTS artist_quotas (
  id SERIAL PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  proof_of_payment VARCHAR(500),
  notes TEXT,
  approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_artist_quotas_artist_id ON artist_quotas(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_quotas_status ON artist_quotas(status);
CREATE INDEX IF NOT EXISTS idx_artist_quotas_payment_date ON artist_quotas(payment_date);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_artist_quotas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER artist_quotas_updated_at
  BEFORE UPDATE ON artist_quotas
  FOR EACH ROW
  EXECUTE FUNCTION update_artist_quotas_updated_at();
