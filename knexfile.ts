import dotenv from 'dotenv'
import Knex from 'knex'

dotenv.config({ path: '.env' })

const config: Knex.Config = {
  client: 'mysql',
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    debug: process.env.DB_DEBUG === 'true' ? true : false
  },
  migrations: {
    tableName: process.env.DB_MIGRATION_TABLE_NAME || '_migrations',
    directory: process.env.DB_MIGRATION_DIRECTORY || 'migrations',
    stub: process.env.DB_MIGRATION_STUB || 'migrations/.stub'
  },
  seeds: {
    directory: process.env.DB_SEED || 'seeds'
  },
  pool: {
    min: Number(process.env.DB_POOL_MIN) || 10,
    max: Number(process.env.DB_POOL_MAX) || 10
  }
}

export = config
