-- Database creation handled by connection/setup
-- Tables will be created in the selected database


CREATE TABLE IF NOT EXISTS plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    item_count INT NOT NULL,
    price INT DEFAULT 0,
    description VARCHAR(255)
);

INSERT IGNORE INTO plans (id, name, item_count, price, description) VALUES 
(1, 'Plan A', 5, 2000, 'Starter Pack: Choose 5 essentials'),
(2, 'Plan B', 10, 3500, 'Pro Pack: Choose 10 items for maximum gains');

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255)
);

-- Insert Sample Products
INSERT IGNORE INTO products (name, category, description, price, image_url) VALUES
('Banana', 'Fresh Fruits', 'Rich in potassium, great for pre-workout.', 10.00, '/banana_pile.png'),
('Apple', 'Fresh Fruits', 'An apple a day keeps the doctor away.', 25.00, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=1974&auto=format&fit=crop'),
('Oranges', 'Fresh Fruits', 'Vitamin C boost.', 20.00, '/fresh_fruits.png'),
('Kiwi', 'Fresh Fruits', 'Vitamin C and K powerhouse.', 40.00, '/kiwi_pile.png'),
('Avocado', 'Fresh Fruits', 'Healthy fats and fiber.', 60.00, '/avocado_pile.png'),
('Watermelon', 'Fresh Fruits', 'Hydrating and refreshing.', 50.00, '/watermelon_pile.png'),
('Dates', 'Dry Fruits', 'Natural energy booster.', 80.00, '/dates_glossy.png'),
('Dry Grapes', 'Dry Fruits', 'Sweet and healthy raisins.', 120.00, '/dry_grapes_mix.png'),
('Apricot', 'Dry Fruits', 'Natural sweetness and fiber.', 140.00, '/apricot_pattern.png'),
('Chia Seeds', 'Seeds', 'Fiber and Omega-3 powerhouse.', 50.00, '/chia_seeds_spoon.png'),
('Flax Seeds', 'Seeds', 'Good for heart health.', 45.00, '/flax_seeds_spoon.png'),
('Pumpkin Seeds', 'Seeds', 'Zinc and magnesium rich.', 60.00, '/pumpkin_seeds_bowl.png'),
('Mixed Nuts', 'Nuts', 'Perfect blend of all your favorites.', 250.00, 'https://images.unsplash.com/photo-1525287373976-591bd0bc3eb7?q=80&w=2070&auto=format&fit=crop'),
('Oranges', 'Fresh Fruits', 'Vitamin C boost.', 20.00, '/fresh_fruits.png');

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255), -- Simple implementation using local storage ID
    product_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100),
    email TEXT,
    phone VARCHAR(20),
    address TEXT,
    payment_method VARCHAR(50),
    total_amount DECIMAL(10, 2),
    items JSON,
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
