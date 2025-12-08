-- Add show_in_public column to artists table
-- This field controls whether the artist appears in the public "Artistas do Movimento" section

ALTER TABLE artists 
ADD COLUMN IF NOT EXISTS show_in_public BOOLEAN DEFAULT true;

-- Set all existing artists to show in public by default
UPDATE artists SET show_in_public = true WHERE show_in_public IS NULL;

-- Add comment to explain the column
COMMENT ON COLUMN artists.show_in_public IS 'Controls if artist appears in public "Artistas do Movimento" section';
