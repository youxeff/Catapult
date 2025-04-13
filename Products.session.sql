CREATE TABLE IF NOT EXISTS tiktok_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    sell_price DECIMAL(10,2),
    supplier VARCHAR(100),
    rating DECIMAL(2,1),
    scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tiktok_products (product_name, sell_price, supplier, rating)
VALUES



('Iphone 16', 2000, 'Ali Baba', 4.4,'Electronics'),
('Samsung 16 Pro', 2500, 'Best Buy', 4.5, 'Electronics'),
('T-SHIRT', 3000, 'Ali Baba', 4.6, 'Clothing & Apparel'),
('Supplements', 3500, 'Ali Baba', 4.7, 'Health & Wellness'),
('ToothBrush', 1500, 'Ali Baba', 4.3, 'Electronics'),
('Hairdye', 1800, 'Ali Baba', 4.2, 'Beauty & Personal Care'),
('Shampoo', 1200, 'Ali Baba', 4.1, 'Beauty & Personal Care'),
('Conditioner', 1300, 'Ali Baba', 4.0, 'Beauty & Personal Care'),
('Facewash', 1400, 'Ali Baba', 4.5, 'Beauty & Personal Care'),
('Lipstick', 1600, 'Ali Baba', 4.6, 'Beauty & Personal Care'),
('Perfume', 1700, 'Ali Baba', 4.7, 'Beauty & Personal Care'),
('Sunglasses', 1900, 'Ali Baba', 4.8, 'Accessories'),
('Watches', 2100, 'Ali Baba', 4.9,'Accessories');

SELECT * FROM tiktok_products;