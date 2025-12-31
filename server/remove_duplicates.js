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

    // 1. Delete duplicates, keeping the lowest ID for each name
    // SQL: DELETE p1 FROM products p1 INNER JOIN products p2 WHERE p1.id > p2.id AND p1.name = p2.name;

    const sql = `
        DELETE p1 
        FROM products p1 
        INNER JOIN products p2 
        WHERE p1.id > p2.id AND p1.name = p2.name
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Cleanup failed:', err);
        } else {
            console.log(`Deleted ${result.affectedRows} duplicates.`);
        }

        // 2. Add UNIQUE constraint to prevent future duplicates
        db.query("ALTER TABLE products ADD CONSTRAINT unique_name UNIQUE (name)", (err) => {
            if (err) {
                // Ignore if already exists or fails (e.g. if duplicates verify failed)
                console.log('Constraint note:', err.message);
            } else {
                console.log('Added UNIQUE constraint to products.name');
            }
            db.end();
            process.exit(0);
        });
    });
});
