import 'dotenv/config';

module.exports = {
   "type": "mysql",
   "host": process.env.DB_HOST!,
   "port": process.env.DB_PORT!,
   "username": process.env.DB_USER!,
   "password": process.env.DB_PASS!,
   "database": "quokkaBoard",
   "synchronize": true,
   "logging": false,
   "entities": [ "src/db/entity/**/*.ts" ],
   "migrations": [ "src/db/migration/**/*.ts" ],
   "subscribers": [ "src/db/subscriber/**/*.ts" ],
   "cli": {
      "entitiesDir": "src/db/entity",
      "migrationsDir": "src/db/migration",
      "subscribersDir": "src/db/subscriber"
   }
};