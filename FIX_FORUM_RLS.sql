-- Fix Forum RLS Issue - Allow public replies
-- Execute this in Supabase SQL Editor

-- 1. Check current RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('forum_topics', 'forum_replies');

-- 2. Disable RLS on forum_replies table (simplest solution)
ALTER TABLE forum_replies DISABLE ROW LEVEL SECURITY;

-- 3. Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'forum_replies';

-- 4. Test: Try to insert a test reply
-- INSERT INTO forum_replies (topic_id, author_name, content, author_id, likes)
-- VALUES (
--   '3619f417-ad3a-4dd7-8925-e4e8da776bda',
--   'Test User',
--   'Test reply content',
--   NULL,
--   0
-- );
