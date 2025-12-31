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

    // Insert Protein Bar if missing
    const sql = `
        INSERT INTO products (name, category, description, price, image_url) 
        SELECT 'Protein Bar', 'Snacks', '20g protein per bar, chocolate flavor.', 120.00, 'https://images.unsplash.com/photo-1622484213295-25d2c56b73ae?q=80&w=2070&auto=format&fit=crop'
        WHERE NOT EXISTS (SELECT * FROM products WHERE name = 'Protein Bar')
    `;

    db.query(sql, (err) => {
        if (err) console.error(err);
        else console.log('Ensured Protein Bar exists');
        db.end();
        process.exit(0);
    });
});
