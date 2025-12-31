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

    // Update Pumpkin Seeds to use the local bowl image uploaded by user
    db.query("UPDATE products SET image_url = '/pumpkin_seeds_bowl.png' WHERE name = 'Pumpkin Seeds'", (err) => {
        if (err) {
            console.error('Update failed:', err);
        } else {
            console.log('Updated Pumpkin Seeds image to local bowl image successfully');
        }
        db.end();
        process.exit(0);
    });
});
