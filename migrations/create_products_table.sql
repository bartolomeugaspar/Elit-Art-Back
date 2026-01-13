-- Migration: Create products table for Loja Digital
-- Date: 2026-01-13
-- Description: Creates the products table with all necessary fields for the online store

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('hat', 'backpack', 'tshirt')),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  discount_price DECIMAL(10, 2) CHECK (discount_price >= 0 AND discount_price < price),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sku VARCHAR(100) NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  author VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_products_updated_at ON products;
CREATE TRIGGER trigger_update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Insert some example products for testing
INSERT INTO products (name, description, category, price, stock, sku, image_url, author) VALUES
  ('Chapéu Elit Arte', 'Chapéu elegante com logo Elit Arte bordado', 'hat', 45.00, 50, 'HAT-001', 'https://placehold.co/400x600/8b5cf6/fff?text=Chapeu+Elit', 'Elit Arte'),
  ('Mochila Elit Arte Premium', 'Mochila de alta qualidade com compartimentos para laptop', 'backpack', 120.00, 30, 'BACK-001', 'https://placehold.co/400x600/ec4899/fff?text=Mochila', 'Elit Arte'),
  ('T-shirt Elit Arte Preta', 'T-shirt 100% algodão com estampa exclusiva', 'tshirt', 65.00, 100, 'TSHIRT-001', 'https://placehold.co/400x600/f59e0b/fff?text=T-shirt', 'Elit Arte'),
  ('T-shirt Elit Arte Branca', 'T-shirt 100% algodão branca com logo frontal', 'tshirt', 65.00, 100, 'TSHIRT-002', 'https://placehold.co/400x600/10b981/fff?text=T-shirt', 'Elit Arte')
ON CONFLICT (sku) DO NOTHING;

-- Verify the table was created
SELECT 
  'Products table created successfully. Total products: ' || COUNT(*)::text as status
FROM products;
