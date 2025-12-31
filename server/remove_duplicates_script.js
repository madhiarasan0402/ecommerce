
const db = require('./db');

db.query('SELECT * FROM products', (err, products) => {
    if (err) {
        console.error('Error fetching products:', err);
        process.exit(1);
    }

    const seen = new Set();
    const idsToDelete = [];

    products.forEach(p => {
        const key = `${p.name}-${p.category}`;
        if (seen.has(key)) {
            idsToDelete.push(p.id);
        } else {
            seen.add(key);
        }
    });

    console.log(`Found ${idsToDelete.length} duplicates to remove.`);

    if (idsToDelete.length > 0) {
        const sql = `DELETE FROM products WHERE id IN (${idsToDelete.join(',')})`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error deleting duplicates:', err);
            } else {
                console.log(`Successfully deleted ${result.affectedRows} duplicate products.`);
            }
            process.exit(0);
        });
    } else {
        console.log('No duplicates found.');
        process.exit(0);
    }
});
