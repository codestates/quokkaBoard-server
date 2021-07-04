import { ConnectionOptions } from 'typeorm';
import 'dotenv/config';

const ormconfig: ConnectionOptions = {

   "type": "mysql",
   "host": process.env.DB_HOST!,
   "port": Number(process.env.DB_PORT!),
   "username": process.env.DB_USER!,
   "password": process.env.DB_PASS!,
   "database": "quokkaBoard",
   "synchronize": false,
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

export default ormconfig;