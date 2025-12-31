const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'GYM'
});

const updates = [
    // Dry Fruits
    { id: 3, url: 'https://images.unsplash.com/photo-1508061253366-f7da98e604ef?q=80&w=600&auto=format&fit=crop' }, // Almonds
    { id: 4, url: 'https://images.unsplash.com/photo-1543542296-1c7c45851457?q=80&w=600&auto=format&fit=crop' }, // Cashews
    { id: 8, url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop' }, // Walnuts (Dry fruit mix img)
    { id: 9, url: 'https://images.unsplash.com/photo-1550970899-73e042797e8e?q=80&w=600&auto=format&fit=crop' }, // Dates

    // Seeds
    { id: 5, url: 'https://images.unsplash.com/photo-1628678092288-75697666d936?q=80&w=600&auto=format&fit=crop' }, // Chia
    { id: 7, url: 'https://images.unsplash.com/photo-1622619890538-3168856a9437?q=80&w=600&auto=format&fit=crop' }, // Flax
    { id: 10, url: 'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?q=80&w=600&auto=format&fit=crop' }, // Pumpkin (Targeted)

    // Snacks
    { id: 6, url: 'https://images.unsplash.com/photo-1622484214029-026850d9c4bf?q=80&w=600&auto=format&fit=crop' }, // Protein Bar (Specific)

    // Nuts
    { id: 11, url: 'https://images.unsplash.com/photo-1532598370776-3d717f9e574d?q=80&w=600&auto=format&fit=crop' } // Mixed Nuts
];

db.connect(async (err) => {
    if (err) throw err;
    console.log('Connected to DB');

    for (const item of updates) {
        const sql = `UPDATE products SET image_url = ? WHERE id = ?`;
        await new Promise((resolve) => {
            db.query(sql, [item.url, item.id], (err, res) => {
                if (err) console.error(err);
                else console.log(`Updated product ${item.id}`);
                resolve();
            });
        });
    }

    db.end();
    process.exit();
});
