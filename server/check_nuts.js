const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected.');

    db.query("SELECT * FROM products WHERE name LIKE '%Nut%' OR name LIKE '%Mix%'", (err, results) => {
        if (err) throw err;
        console.log('Products found:', results);
        db.end();
    });
});
