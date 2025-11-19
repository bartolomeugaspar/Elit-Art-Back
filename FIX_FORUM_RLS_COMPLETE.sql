-- Complete Fix for Forum RLS Issue
-- This script ensures forum_replies and forum_topics tables allow public access

-- ============================================
-- 1. DISABLE RLS ON BOTH TABLES (Simplest)
-- ============================================
ALTER TABLE forum_replies DISABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('forum_topics', 'forum_replies')
ORDER BY tablename;

-- ============================================
-- 2. TEST: Insert a test reply
-- ============================================
-- Uncomment to test:
-- INSERT INTO forum_replies (topic_id, author_name, content, author_id, likes)
-- VALUES (
--   '3619f417-ad3a-4dd7-8925-e4e8da776bda',
--   'Test User',
--   'This is a test reply',
--   NULL,
--   0
-- );

-- ============================================
-- 3. VERIFY: Check if test reply was inserted
-- ============================================
-- SELECT COUNT(*) as reply_count FROM forum_replies 
-- WHERE topic_id = '3619f417-ad3a-4dd7-8925-e4e8da776bda';

-- ============================================
-- 4. CLEANUP: Delete test reply if needed
-- ============================================
-- DELETE FROM forum_replies 
-- WHERE topic_id = '3619f417-ad3a-4dd7-8925-e4e8da776bda' 
-- AND author_name = 'Test User';
