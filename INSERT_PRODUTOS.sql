INSERT INTO products (name, description, category, price, discount_price, image_url, stock, sku, author, isbn, pages, publication_date, is_digital, is_active)
VALUES
  ('Arte Moderna em Angola', 'Livro sobre a história da arte moderna angolana', 'book', 45.99, 39.99, 'https://elit-arte.vercel.app/icon.jpeg', 25, 'BOOK-001', 'João Silva', '978-1234567890', 320, '2023-01-15', FALSE, TRUE),
  ('Revista Elit''Art #1', 'Primeira edição da revista trimestral Elit''Art', 'magazine', 12.50, 10.00, 'https://elit-arte.vercel.app/icon.jpeg', 50, 'MAG-001', NULL, NULL, NULL, '2025-01-01', FALSE, TRUE),
  ('Ingresso - Exposição Anual', 'Ingresso para a exposição anual de arte', 'ticket', 25.00, NULL, 'https://elit-arte.vercel.app/icon.jpeg', 100, 'TICKET-001', NULL, NULL, NULL, NULL, FALSE, TRUE),
  ('Camiseta Elit''Art Edição Limitada', 'Camiseta com logo da Elit''Art - edição limitada', 'merchandise', 35.00, 28.00, 'https://elit-arte.vercel.app/icon.jpeg', 75, 'MERCH-001', NULL, NULL, NULL, NULL, FALSE, TRUE),
  ('Poesia Contemporânea Angolana', 'Coletânea de poesias de autores angolanos contemporâneos', 'book', 29.99, 24.99, 'https://elit-arte.vercel.app/icon.jpeg', 40, 'BOOK-002', 'Maria Santos', '978-0987654321', 256, '2024-06-20', FALSE, TRUE),
  ('E-book: Guia de Artes Visuais', 'Guia digital sobre técnicas de artes visuais', 'book', 15.99, NULL, 'https://elit-arte.vercel.app/icon.jpeg', 999, 'EBOOK-001', 'Carlos Mendes', NULL, 180, '2025-01-10', TRUE, TRUE),
  ('Revista Elit''Art #2', 'Segunda edição da revista trimestral Elit''Art', 'magazine', 12.50, 10.00, 'https://elit-arte.vercel.app/icon.jpeg', 45, 'MAG-002', NULL, NULL, NULL, '2025-04-01', FALSE, TRUE),
  ('Workshop - Pintura Acrílica', 'Ingresso para workshop de pintura acrílica', 'ticket', 50.00, 40.00, 'https://elit-arte.vercel.app/icon.jpeg', 30, 'TICKET-002', NULL, NULL, NULL, NULL, FALSE, TRUE);
