require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT
    }
};
















// {
//   "development": {
//     "username": "postgres",
//     "password": "root",
//     "database": "chat_app",
//     "host": "localhost",
//     "dialect": "postgres"
//   },
//   "test": {
//     "username": "postgres",
//     "password": "root",
//     "database": "chat_app",
//     "host": "localhost",
//     "dialect": "postgres"
//   },
//   "production": {
//     "username": "postgres",
//     "password": "root",
//     "database": "chat_app",
//     "host": "localhost",
//     "dialect": "postgres"
//   }
// }