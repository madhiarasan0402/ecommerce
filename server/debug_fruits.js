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

    db.query("SELECT name, category FROM products WHERE category LIKE '%Fruit%'", (err, results) => {
        if (err) {
            console.error('Query failed:', err);
        } else {
            console.log('--- FRUITS DEBUG ---');
            results.forEach(r => {
                console.log(`Name: '${r.name}', Category: '${r.category}' (len: ${r.category.length})`);
            });
        }
        db.end();
        process.exit(0);
    });
});
