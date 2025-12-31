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

    // 1. Delete Walnuts
    db.query("DELETE FROM products WHERE name = 'Walnuts'", (err) => {
        if (err) {
            console.error('Delete failed:', err);
            // Don't exit, try inserting Apricot anyway
        } else {
            console.log('Deleted Walnuts');
        }

        // 2. Insert Apricot using a public image since generation is down
        // Using a similar rustic wooden bowl look to match existing items
        const apricotUrl = 'https://images.unsplash.com/photo-1606558661642-16aee96a6058?q=80&w=1934&auto=format&fit=crop';

        const sql = `INSERT INTO products (name, category, description, price, image_url) VALUES 
            ('Apricot', 'Dry Fruits', 'Natural sweetness and fiber.', 140.00, '${apricotUrl}')
        `;

        db.query(sql, (err) => {
            if (err) {
                console.error('Insert Apricot failed:', err);
            } else {
                console.log('Inserted Apricot successfully');
            }
            db.end();
            process.exit(0);
        });
    });
});
