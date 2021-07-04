// const { Connection, Request } = require('tedious');
const sql = require('mssql');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });


const config = {
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: "CriminalData",
    server: process.env.DATABASE_SERVER,
    port: 1433,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
}

module.exports = config;