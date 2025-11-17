-- Create anonymous user for event registrations
-- This user ID is used as a placeholder for anonymous registrations
INSERT INTO users (id, name, email, password, role, is_email_verified, is_active, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'Anonymous User',
  'anonymous@elit-Arte.local',
  '$2b$10$YIjlrJxnM5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z', -- dummy hashed password
  'user',
  false,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;
