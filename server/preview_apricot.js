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

    // Update Apricot to use the local pattern image
    db.query("UPDATE products SET image_url = '/apricot_pattern.png' WHERE name = 'Apricot'", (err) => {
        if (err) {
            console.error('Update failed:', err);
        } else {
            console.log('Updated Apricot image successfully');
        }
        db.end();
        process.exit(0);
    });
});
