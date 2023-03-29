// const path = require('path');

// module.exports = ({ env }) => ({
//   connection: {
//     client: 'sqlite',
//     connection: {
//       filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
//     },
//     useNullAsDefault: true,
//   },
// });
const parse = require('pg-connection-string').parse;
const DATABASE_URL = process.env.NODE_ENV == 'production' ? process.env.HEROKU_POSTGRESQL_MAROON_URL : process.env.DATABASE_URL;
const config = parse(DATABASE_URL);

module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: false
    },
    debug: true,
  },
}); 