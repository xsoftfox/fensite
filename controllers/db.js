var postgres = require('postgres');
var db = postgres({
  host                 : 'localhost',            // Postgres ip address[s] or domain name[s]
  port                 : 5432,          // Postgres server port[s]
  database             : 'site',            // Name of database to connect to
  username             : process.env.DB_USER,            // Username of database user
  password             : process.env.DB_PW            // Password of database user
})

exports.db = db;
