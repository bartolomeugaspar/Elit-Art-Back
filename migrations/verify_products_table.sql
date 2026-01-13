-- Verify products table structure and data
-- Run this script to check if the products table exists and has data

-- Check if table exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'products'
    )
    THEN 'Products table EXISTS'
    ELSE 'Products table DOES NOT EXIST'
  END as table_status;

-- Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'products'
ORDER BY ordinal_position;

-- Count products
SELECT COUNT(*) as total_products FROM products;

-- Show all products
SELECT 
  id,
  name,
  category,
  price,
  stock,
  sku,
  is_active,
  created_at
FROM products
ORDER BY created_at DESC;
