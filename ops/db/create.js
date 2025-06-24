require('dotenv').config();
const mysql = require('mysql2');
const databaseConfig = require('../../App/Infrastructure/Config').database.mysql;
const dbName = databaseConfig.DB;
const logger = require("../../App/Infrastructure/Logger/logger")

const connection = mysql.createConnection({
  host: databaseConfig.HOST,
  user: databaseConfig.USERNAME,
  password: databaseConfig.PASSWORD,
});

connection.connect((err) => {
  if (err) throw err;
  connection.query(`CREATE DATABASE ${dbName}`, (err, result) => {
    if (err && err.code === 'ER_DB_CREATE_EXISTS') {
      logger.info('Db already created')
      process.exit(0);
    }

    if (err) {
      throw err;
    }

    logger.info('Created db')
    process.exit(0);
  });
});
