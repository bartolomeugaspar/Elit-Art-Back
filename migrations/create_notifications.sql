-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(255),
  reference_id UUID,
  reference_type VARCHAR(50),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = false;

-- Comentários
COMMENT ON TABLE notifications IS 'Tabela de notificações para administradores';
COMMENT ON COLUMN notifications.type IS 'Tipo de notificação: contact, registration, order, comment, user, blog, artwork, artist, event, press';
COMMENT ON COLUMN notifications.reference_id IS 'ID do recurso relacionado';
COMMENT ON COLUMN notifications.reference_type IS 'Tipo do recurso relacionado';
