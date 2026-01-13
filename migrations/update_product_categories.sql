-- Migration: Update product categories from book/magazine/ticket/merchandise to hat/backpack/tshirt
-- Date: 2026-01-13
-- Description: Updates the products table to use new category types for merchandise

-- Step 1: Drop the old CHECK constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_check;

-- Step 2: Add new CHECK constraint with updated categories
ALTER TABLE products ADD CONSTRAINT products_category_check 
  CHECK (category IN ('hat', 'backpack', 'tshirt'));

-- Step 3: Update existing products (optional - only if you want to migrate old data)
-- Uncomment the lines below if you want to map old categories to new ones:

-- UPDATE products SET category = 'tshirt' WHERE category = 'merchandise';
-- UPDATE products SET category = 'hat' WHERE category = 'book';
-- UPDATE products SET category = 'backpack' WHERE category = 'magazine';
-- UPDATE products SET category = 'tshirt' WHERE category = 'ticket';

-- Step 4: Verify the changes
SELECT 
  category,
  COUNT(*) as total_products
FROM products
GROUP BY category
ORDER BY category;

SELECT 'Category constraint updated successfully!' as status;
