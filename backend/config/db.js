const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection(async (err, connection) => {
  if (err) {
    console.log("Database Connection Failed");
    console.log(err.message);
  } else {
    console.log("MySQL Connected Successfully");
    try {
      await connection.promise().query(
        "ALTER TABLE bookings ADD COLUMN payment_method VARCHAR(50) DEFAULT 'cash'"
      );
      console.log("Added payment_method column to bookings table.");
    } catch (migrationErr) {
      if (migrationErr.errno === 1060 || migrationErr.code === 'ER_DUP_FIELDNAME') {
        // Column already exists, no action needed
      } else {
        console.error("Migration warning:", migrationErr.message);
      }
    }
    connection.release();
  }
});

module.exports = db.promise();