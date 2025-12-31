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

    // Update Flax Seeds to use the local spoon image uploaded by user
    db.query("UPDATE products SET image_url = '/flax_seeds_spoon.png' WHERE name = 'Flax Seeds'", (err) => {
        if (err) {
            console.error('Update failed:', err);
        } else {
            console.log('Updated Flax Seeds image to local spoon image successfully');
        }
        db.end();
        process.exit(0);
    });
});
