import dotenv from 'dotenv';
dotenv.config();

export default {
  local: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: true,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    operatorsAliases: '0',
  },
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: true,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    operatorsAliases: '0',
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: true,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    operatorsAliases: '0',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: true,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    operatorsAliases: '0',
  },
};
