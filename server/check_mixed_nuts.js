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
        return;
    }

    db.query("SELECT * FROM products WHERE name = 'Mixed Nuts'", (err, results) => {
        if (err) console.error(err);
        else console.log('Mixed Nuts entries:', results);
        db.end();
    });
});
