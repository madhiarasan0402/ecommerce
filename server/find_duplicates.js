
const db = require('./db');

db.query('SELECT name, category, COUNT(*) as count FROM products GROUP BY name, category HAVING count > 1', (err, results) => {
    if (err) {
        console.error('Error fetching duplicates:', err);
        process.exit(1);
    }
    console.log('Duplicate Groups:', results.length);
    results.forEach(p => {
        console.log(`Name: ${p.name}, Category: ${p.category}, Count: ${p.count}`);
    });
    process.exit(0);
});
