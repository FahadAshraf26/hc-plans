require('dotenv').config();
const mysql = require('mysql2');
const databaseConfig = require('../../App/Infrastructure/Config').database.mysql;
const logger = require("../../App/Infrastructure/Logger/logger")

const dbName = databaseConfig.DB;

const connection = mysql.createConnection({
  host: databaseConfig.HOST,
  user: databaseConfig.USERNAME,
  password: databaseConfig.PASSWORD,
});

connection.connect((err) => {
  if (err) throw err;
  connection.query(`DROP SCHEMA ${dbName}`, (err, result) => {
    if (err && err.code === 'ER_DB_DROP_EXISTS') {
      logger.info('Db already deleted')
      process.exit(0);
    }

    if (err) throw err;

    logger.info('Deleted db')
    process.exit(0);
  });
});
