-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Add row-level security policies if needed
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to admins
CREATE POLICY "Enable read access for admins" 
ON audit_logs
FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated' AND auth.uid() IN (
  SELECT id FROM users WHERE role = 'admin'
));

-- Create policy to prevent modifications (audit logs should be append-only)
CREATE POLICY "Prevent modifications to audit logs"
ON audit_logs
FOR ALL
USING (false);
