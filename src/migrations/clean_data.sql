-- Clean Data Script
-- Remove all test data from the new feature tables
-- Execute this if you need to reset the database
-- Date: 2025-11-19

-- Disable foreign key constraints temporarily
ALTER TABLE forum_replies DISABLE TRIGGER ALL;
ALTER TABLE blog_comments DISABLE TRIGGER ALL;

-- Delete all data in reverse order of dependencies
DELETE FROM forum_replies;
DELETE FROM forum_topics;
DELETE FROM blog_comments;
DELETE FROM blog_posts;
DELETE FROM artworks;
DELETE FROM press_releases;
DELETE FROM media_kits;
DELETE FROM orders;
DELETE FROM products;

-- Re-enable foreign key constraints
ALTER TABLE forum_replies ENABLE TRIGGER ALL;
ALTER TABLE blog_comments ENABLE TRIGGER ALL;

-- Reset sequences (if applicable)
-- ALTER SEQUENCE products_id_seq RESTART WITH 1;
-- ALTER SEQUENCE blog_posts_id_seq RESTART WITH 1;

-- Verify all tables are empty
SELECT 'products' as table_name, COUNT(*) as count FROM products
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'blog_comments', COUNT(*) FROM blog_comments
UNION ALL
SELECT 'artworks', COUNT(*) FROM artworks
UNION ALL
SELECT 'press_releases', COUNT(*) FROM press_releases
UNION ALL
SELECT 'media_kits', COUNT(*) FROM media_kits
UNION ALL
SELECT 'forum_topics', COUNT(*) FROM forum_topics
UNION ALL
SELECT 'forum_replies', COUNT(*) FROM forum_replies;
