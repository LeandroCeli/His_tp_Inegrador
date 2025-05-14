// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'his_internacion',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
