-- Debug Forum Topic and RLS Status
-- Run this in Supabase SQL Editor to diagnose the issue

-- 1. Check the specific topic
SELECT id, title, is_closed, is_pinned, replies_count, created_at
FROM forum_topics
WHERE id = '3619f417-ad3a-4dd7-8925-e4e8da776bda';

-- 2. Check RLS status on both tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('forum_topics', 'forum_replies')
ORDER BY tablename;

-- 3. Check all policies on forum_replies
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'forum_replies'
ORDER BY tablename, policyname;

-- 4. Check all policies on forum_topics
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'forum_topics'
ORDER BY tablename, policyname;

-- 5. If RLS is still enabled on forum_replies, disable it
-- ALTER TABLE forum_replies DISABLE ROW LEVEL SECURITY;

-- 6. If RLS is still enabled on forum_topics, disable it
-- ALTER TABLE forum_topics DISABLE ROW LEVEL SECURITY;

-- 7. Verify after disabling
-- SELECT tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE tablename IN ('forum_topics', 'forum_replies');
