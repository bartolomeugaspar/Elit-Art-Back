-- Criar tabela de configurações de notificações
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Canais de notificação
  email_enabled BOOLEAN DEFAULT true,
  push_enabled BOOLEAN DEFAULT true,
  
  -- Relatórios
  weekly_report BOOLEAN DEFAULT true,
  monthly_report BOOLEAN DEFAULT true,
  
  -- Alertas específicos
  new_registrations BOOLEAN DEFAULT true,
  new_orders BOOLEAN DEFAULT true,
  new_contacts BOOLEAN DEFAULT true,
  new_comments BOOLEAN DEFAULT true,
  new_users BOOLEAN DEFAULT true,
  
  -- Segurança
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Índice para busca rápida por user_id
CREATE INDEX IF NOT EXISTS idx_notification_settings_user_id ON notification_settings(user_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_notification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_notification_settings_updated_at ON notification_settings;
CREATE TRIGGER trigger_update_notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_settings_updated_at();

-- Inserir configurações padrão para todos os usuários admin existentes
INSERT INTO notification_settings (user_id)
SELECT id FROM users WHERE role = 'admin'
ON CONFLICT (user_id) DO NOTHING;
