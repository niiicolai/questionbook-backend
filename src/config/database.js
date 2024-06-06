// index.js also imports .env file
// however, I added it here as well
// to ensure the database file can
// access the environment variables
// if the index.js file is not running.
import 'dotenv/config' 

// Import the mysql2 package,
// which is a driver for connecting to MySQL.
import mysql from 'mysql2/promise';

// Create a connection pool instead of a
// single connection to handle multiple
// connections at the same time, and
// reduce the time it takes to establish
// a connection to the database (because,
// the connection is already established).
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,

    // Determines the pool's action when 
    // no connections are available and the 
    // limit has been reached. If true, the 
    // pool will queue the connection request 
    // and call it when one becomes available. 
    // If false, the pool will immediately 
    // call back with an error. (Default: true)
    waitForConnections: true,

    // The maximum number of connections 
    // to create at once. (Default: 10)
    connectionLimit: 10,
    // The maximum number of connection 
    // requests the pool will queue 
    // before returning an error from 
    // getConnection. If set to 0, there 
    // is no limit to the number of queued 
    // connection requests. (Default: 0)
    queueLimit: 0
});

export default pool;
