const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'GYM'
});

db.connect(err => {
    if (err) {
        console.error('Connection failed:', err);
        process.exit(1);
    }

    // 1. DROP products table to clear everything
    db.query("DROP TABLE IF EXISTS products", (err) => {
        if (err) console.error(err);
        console.log('Dropped products table');

        // 2. Re-create
        const createSql = `
            CREATE TABLE products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                category VARCHAR(50),
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                image_url VARCHAR(255)
            )
        `;
        db.query(createSql, (err) => {
            if (err) console.error(err);
            console.log('Created products table');

            // 3. Insert Clean Data
            const insertSql = `
                INSERT INTO products (name, category, description, price, image_url) VALUES
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
                ('Mixed Nuts', 'Nuts', 'Perfect blend of all your favorites.', 250.00, 'https://images.unsplash.com/photo-1525287373976-591bd0bc3eb7?q=80&w=2070&auto=format&fit=crop')
            `;
            db.query(insertSql, (err) => {
                if (err) console.error(err);
                else console.log('Inserted clean products');

                db.end();
                process.exit(0);
            });
        });
    });
});
