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

    // Update Chia Seeds to use the local spoon image
    db.query("UPDATE products SET image_url = '/chia_seeds_spoon.png' WHERE name = 'Chia Seeds'", (err) => {
        if (err) {
            console.error('Update failed:', err);
        } else {
            console.log('Updated Chia Seeds image successfully');
        }
        db.end();
        process.exit(0);
    });
});
