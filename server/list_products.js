
const db = require('./db');

db.query('SELECT * FROM products ORDER BY name', (err, results) => {
    if (err) {
        console.error('Error fetching products:', err);
        process.exit(1);
    }
    console.log('Total products:', results.length);
    results.forEach(p => {
        console.log(`ID: ${p.id}, Name: ${p.name}, Category: ${p.category}`);
    });
    process.exit(0);
});
