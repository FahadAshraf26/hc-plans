import { Sequelize } from 'sequelize';
import config from '../Config';
import logger from '../Logger/logger';

const { database, server } = config;
const mysql = database.mysql;
const IS_DEBUG_MODDE = server;
const sequelize = new Sequelize(mysql.DB, mysql.USERNAME, mysql.PASSWORD, {
  dialect: 'mysql',
  host: mysql.HOST,
  // logging: IS_DEBUG_MODDE ? (msg) => logger.debug(msg) : false,
  logging: false,
  pool: {
    max: 5,
    min: 1,
  },
  dialectOptions: {
    multipleStatements: true,
  },
});

logger.info(`[DB]: Connecting to ${mysql.DB} at ${mysql.HOST}`);
sequelize
  .authenticate()
  .then(() => {
    logger.debug(`[DB]: Connected to ${mysql.DB} at ${mysql.HOST}`);
  })
  .catch((err) => {
    logger.debug('[DB]: Connection Error Database not connected', err.message);
    process.exit(1);
  });
sequelize.sync();

sequelize.addHook('beforeCount', function (options) {
  const includeAvailable = options.include && options.include.find((item) => item['where']);

  if (this._scope.include && this._scope.include.length > 0) {
    options.distinct = true;
    options.col = this._scope.col || options.col || `"${this.options.name.singular}".id`;
  }
  const whereSymbols = includeAvailable
    ? Object.getOwnPropertySymbols(includeAvailable['where']).length
    : 0;
  const whereString = includeAvailable
    ? JSON.stringify(includeAvailable['where']).length
    : 0;
  const whereObject = whereSymbols > 0 ? whereSymbols : whereString > 2 ? 1 : 0;

  if (whereObject === 0 && options.include && options.include.length > 0) {
    options.include = null;
  }
});

export default sequelize;
