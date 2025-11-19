INSERT INTO products (name, description, category, price, discount_price, image_url, stock, sku, author, isbn, pages, publication_date, is_digital, is_active)
VALUES
  ('Contos de Luanda', 'Uma coletânea de contos que retratam a vida em Luanda', 'book', 45.99, 39.99, 'https://elit-arte.vercel.app/icon.jpeg', 25, 'BOOK-003', 'Mário Pinto', '978-1111111111', 320, '2023-01-15', FALSE, TRUE),
  ('Revista Elit''Art #3', 'Terceira edição da revista trimestral Elit''Art', 'magazine', 12.50, 10.00, 'https://elit-arte.vercel.app/icon.jpeg', 50, 'MAG-003', NULL, NULL, NULL, '2025-07-01', FALSE, TRUE),
  ('Ingresso - Workshop de Escultura', 'Ingresso para workshop de escultura', 'ticket', 60.00, 50.00, 'https://elit-arte.vercel.app/icon.jpeg', 40, 'TICKET-003', NULL, NULL, NULL, NULL, FALSE, TRUE),
  ('Bolsa Elit''Art Premium', 'Bolsa de lona com logo da Elit''Art', 'merchandise', 45.00, 35.00, 'https://elit-arte.vercel.app/icon.jpeg', 60, 'MERCH-002', NULL, NULL, NULL, NULL, FALSE, TRUE),
  ('Dramaturgia Contemporânea', 'Estudos sobre drama contemporâneo africano', 'book', 39.99, 32.99, 'https://elit-arte.vercel.app/icon.jpeg', 20, 'BOOK-004', 'Sofia Nkosi', '978-2222222222', 280, '2024-09-10', FALSE, TRUE),
  ('E-book: História da Arte Africana', 'Guia digital sobre história da arte africana', 'book', 19.99, NULL, 'https://elit-arte.vercel.app/icon.jpeg', 999, 'EBOOK-002', 'David Okonkwo', NULL, 220, '2025-02-15', TRUE, TRUE),
  ('Revista Elit''Art #4', 'Quarta edição da revista trimestral Elit''Art', 'magazine', 12.50, 10.00, 'https://elit-arte.vercel.app/icon.jpeg', 55, 'MAG-004', NULL, NULL, NULL, '2025-10-01', FALSE, TRUE),
  ('Ingresso - Palestra de Arte Digital', 'Ingresso para palestra sobre arte digital', 'ticket', 35.00, 28.00, 'https://elit-arte.vercel.app/icon.jpeg', 80, 'TICKET-004', NULL, NULL, NULL, NULL, FALSE, TRUE);
