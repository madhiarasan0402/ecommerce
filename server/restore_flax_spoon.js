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

    // Update Flax Seeds to use the "spoon" style image from Unsplash
    // which matches the Chia Seeds style better than the pattern
    const spoonUrl = 'https://images.unsplash.com/photo-1622619890538-3168856a9437?q=80&w=1974&auto=format&fit=crop';

    db.query("UPDATE products SET image_url = ? WHERE name = 'Flax Seeds'", [spoonUrl], (err) => {
        if (err) {
            console.error('Update failed:', err);
        } else {
            console.log('Updated Flax Seeds image to spoon style successfully');
        }
        db.end();
        process.exit(0);
    });
});
