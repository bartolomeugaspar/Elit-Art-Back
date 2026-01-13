-- Script para corrigir as foreign keys da tabela artist_quota_payments
-- Dropar a tabela existente e recriar com as referências corretas

DROP TABLE IF EXISTS artist_quota_payments CASCADE;

-- Recriar a tabela com referências corretas
CREATE TABLE artist_quota_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  valor DECIMAL(10, 2) NOT NULL,
  mes_referencia VARCHAR(7) NOT NULL, -- formato: YYYY-MM
  comprovante_url TEXT,
  metodo_pagamento VARCHAR(50), -- transferencia, deposito, mbway, multicaixa, etc
  observacoes TEXT,
  status VARCHAR(20) DEFAULT 'pendente', -- pendente, aprovado, rejeitado
  data_pagamento TIMESTAMP DEFAULT NOW(),
  aprovado_por UUID REFERENCES users(id) ON DELETE SET NULL,
  data_aprovacao TIMESTAMP,
  motivo_rejeicao TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_artist_quota_payments_artist_id ON artist_quota_payments(artist_id);
CREATE INDEX IF NOT EXISTS idx_artist_quota_payments_status ON artist_quota_payments(status);
CREATE INDEX IF NOT EXISTS idx_artist_quota_payments_mes_referencia ON artist_quota_payments(mes_referencia);

-- RLS (Row Level Security)
ALTER TABLE artist_quota_payments ENABLE ROW LEVEL SECURITY;

-- Política: Artistas podem ver apenas seus próprios pagamentos
CREATE POLICY "Artists can view their own quota payments"
  ON artist_quota_payments FOR SELECT
  USING (
    auth.uid() = artist_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Política: Artistas podem criar seus próprios pagamentos
CREATE POLICY "Artists can create their own quota payments"
  ON artist_quota_payments FOR INSERT
  WITH CHECK (auth.uid() = artist_id);

-- Política: Artistas podem atualizar seus próprios pagamentos pendentes
CREATE POLICY "Artists can update their own pending quota payments"
  ON artist_quota_payments FOR UPDATE
  USING (auth.uid() = artist_id AND status = 'pendente')
  WITH CHECK (auth.uid() = artist_id AND status = 'pendente');

-- Política: Artistas podem deletar seus próprios pagamentos pendentes
CREATE POLICY "Artists can delete their own pending quota payments"
  ON artist_quota_payments FOR DELETE
  USING (auth.uid() = artist_id AND status = 'pendente');

-- Política: Admins podem ver todos os pagamentos
CREATE POLICY "Admins can view all quota payments"
  ON artist_quota_payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Política: Admins podem atualizar qualquer pagamento
CREATE POLICY "Admins can update all quota payments"
  ON artist_quota_payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_artist_quota_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER artist_quota_payments_updated_at
  BEFORE UPDATE ON artist_quota_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_artist_quota_payments_updated_at();

-- Comentários para documentação
COMMENT ON TABLE artist_quota_payments IS 'Tabela de pagamentos de cotas mensais dos artistas';
COMMENT ON COLUMN artist_quota_payments.mes_referencia IS 'Mês de referência do pagamento no formato YYYY-MM';
COMMENT ON COLUMN artist_quota_payments.status IS 'Status do pagamento: pendente, aprovado, rejeitado';
