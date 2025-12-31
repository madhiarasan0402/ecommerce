const mysql = require('mysql2');
const config = require('./config');

const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error connecting to MySQL:', err.code, err.message);
        console.error('   Please check your .env file or ensure MySQL is running.');
    } else {
        console.log('✅ Connected to MySQL database via Pool');
        connection.release();
    }
});

module.exports = pool;
