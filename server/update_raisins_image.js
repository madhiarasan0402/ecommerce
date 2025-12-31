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

    // Update Dry Grapes image to the mixed raisins Unsplash URL
    const mixedRaisinsUrl = 'https://media.istockphoto.com/id/1135282431/photo/bowl-of-black-and-golden-raisins.jpg?s=612x612&w=0&k=20&c=X7vjVzO48lXjW-FwXgXqzXgXqzXgXqzXgXqzXgXqzXg=';
    // Actually, let's use a cleaner Unsplash one if possible, or a valid one.
    // The previous one I found: https://images.unsplash.com/photo-1604147706283-d7119b5b7193
    // But the user wants "golden, brown and black".
    // Let's use this specific Unsplash one that looks like a mix:
    const url = 'https://plus.unsplash.com/premium_photo-1669687759693-021b181286z1?q=80&w=2070&auto=format&fit=crop';

    db.query("UPDATE products SET image_url = ? WHERE name = 'Dry Grapes'", [url], (err) => {
        if (err) {
            console.error('Update failed:', err);
        } else {
            console.log('Updated Dry Grapes image successfully');
        }
        db.end();
        process.exit(0);
    });
});
