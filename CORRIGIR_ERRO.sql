-- Script para Corrigir o Erro de image_url
-- Execute este script para adicionar o produto corretamente

-- ✅ VERSÃO CORRIGIDA - Com image_url
INSERT INTO products (name, description, category, price, stock, sku, image_url, is_active)
VALUES (
  'Livro: Histórias de Angola',
  'Coletânea de histórias tradicionais angolanas',
  'book',
  35.50,
  30,
  'BOOK-HIST-001',
  'https://elit-arte.vercel.app/icon.jpeg',
  TRUE
);

-- Verificar se foi inserido
SELECT name, category, price, stock, image_url FROM products WHERE sku = 'BOOK-HIST-001';
