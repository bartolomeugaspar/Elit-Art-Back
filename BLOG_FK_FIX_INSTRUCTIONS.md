# Fix Blog Posts Foreign Key Constraint Error

## Problem
Error: `insert or update on table "blog_posts" violates foreign key constraint "blog_posts_author_id_fkey"`

## Root Cause
The `blog_posts` table has a foreign key constraint on `author_id` that references the `users` table. When creating a blog post with an `author_id` that doesn't exist in `users`, the constraint is violated.

## Solution

### Step 1: Execute SQL in Supabase
1. Go to https://supabase.com → Your Project → SQL Editor
2. Copy and paste the contents of `FIX_BLOG_FK_CONSTRAINT.sql`
3. Click "Run" to execute

**SQL Command:**
```sql
ALTER TABLE blog_posts 
DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;
```

### Step 2: Restart Backend
After executing the SQL, restart your backend:
```bash
npm run dev
```

## What Changed
- Removed the foreign key constraint from `author_id` column
- `author_id` can now be any UUID or NULL, even if the user doesn't exist in the `users` table
- This is consistent with the anonymous registration fix you implemented earlier

## How It Works Now
- **Authenticated Admin**: Sends their `user_id` as `author_id`
- **Any Author**: Can create blog posts with any `author_id` value
- **author_name**: Stored separately, so author info is preserved even if user is deleted

## Testing
After the fix, you should be able to create blog posts without the FK constraint error.

```bash
curl -X POST http://localhost:5000/api/blog \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "slug": "test-post",
    "content": "Content here",
    "excerpt": "Excerpt",
    "featured_image": "https://example.com/image.jpg",
    "category": "article",
    "author_id": "any-uuid-here",
    "author_name": "Author Name"
  }'
```

## Files Modified
- `/src/migrations/create_new_features.sql` - Updated schema (for future migrations)
- `FIX_BLOG_FK_CONSTRAINT.sql` - SQL fix for existing database
