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
    console.log('Connected to DB');

    // 1. Delete all Seeds to remove duplicates
    db.query("DELETE FROM products WHERE category = 'Seeds'", (err) => {
        if (err) {
            console.error('Delete failed:', err);
            process.exit(1);
        }
        console.log('Deleted old Seeds');

        // 2. Insert unique Seeds with clean images
        const sql = `INSERT INTO products (name, category, description, price, image_url) VALUES 
            ('Chia Seeds', 'Seeds', 'Fiber and Omega-3 powerhouse.', 50.00, 'https://images.unsplash.com/photo-1628678092288-75697666d936?q=80&w=1974&auto=format&fit=crop'),
            ('Flax Seeds', 'Seeds', 'Good for heart health.', 45.00, 'https://images.unsplash.com/photo-1622619890538-3168856a9437?q=80&w=1974&auto=format&fit=crop'),
            ('Pumpkin Seeds', 'Seeds', 'Zinc and magnesium rich.', 60.00, 'https://plus.unsplash.com/premium_photo-1675866107383-7c2763321590?q=80&w=2070&auto=format&fit=crop')
        `;
        // Replaced Pumpkin Seeds image with a guaranteed safe one (not a temple!)

        db.query(sql, (err) => {
            if (err) {
                console.error('Insert Seeds failed:', err);
            } else {
                console.log('Inserted unique Seeds successfully');
            }
            db.end();
            process.exit(0);
        });
    });
});
