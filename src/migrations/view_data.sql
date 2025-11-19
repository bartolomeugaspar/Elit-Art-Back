-- View Data Script
-- Display all test data in a formatted way
-- Execute this to see what data was inserted
-- Date: 2025-11-19

-- ===== PRODUCTS =====
SELECT '=== PRODUTOS ===' as section;
SELECT 
  name,
  category,
  price,
  discount_price,
  stock,
  sku,
  is_active
FROM products
ORDER BY category, name;

-- ===== BLOG POSTS =====
SELECT '' as blank;
SELECT '=== BLOG POSTS ===' as section;
SELECT 
  title,
  slug,
  category,
  author_name,
  status,
  views,
  likes,
  published_at
FROM blog_posts
ORDER BY published_at DESC NULLS LAST, created_at DESC;

-- ===== ARTWORKS =====
SELECT '' as blank;
SELECT '=== OBRAS DE ARTE ===' as section;
SELECT 
  title,
  artist_name,
  type,
  year,
  price,
  is_available,
  is_featured
FROM artworks
ORDER BY year DESC, title;

-- ===== PRESS RELEASES =====
SELECT '' as blank;
SELECT '=== PRESS RELEASES ===' as section;
SELECT 
  title,
  author,
  status,
  publication_date,
  SUBSTRING(summary, 1, 60) || '...' as summary
FROM press_releases
ORDER BY publication_date DESC;

-- ===== MEDIA KITS =====
SELECT '' as blank;
SELECT '=== MEDIA KITS ===' as section;
SELECT 
  title,
  file_type,
  ROUND(file_size::numeric / 1024 / 1024, 2) || ' MB' as file_size,
  downloads
FROM media_kits
ORDER BY title;

-- ===== FORUM TOPICS =====
SELECT '' as blank;
SELECT '=== TÓPICOS DO FÓRUM ===' as section;
SELECT 
  title,
  category,
  author_name,
  replies_count,
  views,
  is_pinned,
  is_closed,
  created_at
FROM forum_topics
ORDER BY is_pinned DESC, created_at DESC;

-- ===== FORUM REPLIES =====
SELECT '' as blank;
SELECT '=== RESPOSTAS DO FÓRUM ===' as section;
SELECT 
  fr.author_name,
  ft.title as topic_title,
  SUBSTRING(fr.content, 1, 50) || '...' as content,
  fr.likes,
  fr.created_at
FROM forum_replies fr
JOIN forum_topics ft ON fr.topic_id = ft.id
ORDER BY fr.created_at DESC;

-- ===== SUMMARY STATISTICS =====
SELECT '' as blank;
SELECT '=== ESTATÍSTICAS ===' as section;
SELECT 
  'Produtos' as entity,
  COUNT(*) as total
FROM products
UNION ALL
SELECT 'Blog Posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'Obras de Arte', COUNT(*) FROM artworks
UNION ALL
SELECT 'Press Releases', COUNT(*) FROM press_releases
UNION ALL
SELECT 'Media Kits', COUNT(*) FROM media_kits
UNION ALL
SELECT 'Tópicos do Fórum', COUNT(*) FROM forum_topics
UNION ALL
SELECT 'Respostas do Fórum', COUNT(*) FROM forum_replies
ORDER BY total DESC;
