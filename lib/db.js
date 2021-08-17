const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'sample_test',
  password: '90251234'
});
connection.connect();

module.exports = connection;
