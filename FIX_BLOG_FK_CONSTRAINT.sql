-- Fix blog_posts foreign key constraint error
-- Execute this in Supabase SQL Editor to remove the FK constraint

ALTER TABLE blog_posts 
DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;
