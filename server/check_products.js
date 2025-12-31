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

    db.query("SELECT id, name, category FROM products", (err, results) => {
        if (err) {
            console.error('Query failed:', err);
        } else {
            console.log('--- ALL PRODUCTS ---');
            console.table(results);

            const fresh = results.filter(r => r.category === 'Fresh Fruits');
            console.log(`Fresh Fruits count: ${fresh.length}`);
        }
        db.end();
        process.exit(0);
    });
});
