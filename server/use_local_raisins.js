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

    // Update Dry Grapes to use the uploaded local image
    db.query("UPDATE products SET image_url = '/dry_grapes_mix.png' WHERE name = 'Dry Grapes'", (err) => {
        if (err) {
            console.error('Update failed:', err);
        } else {
            console.log('Updated Dry Grapes image to local mix successfully');
        }
        db.end();
        process.exit(0);
    });
});
