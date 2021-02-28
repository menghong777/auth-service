import knex from 'knex'
import knexfile from './knexfile'

const DB: {
  connection: null | knex
  instance: knex
  pool: knex
  create: () => knex
} = {
  connection: null,

  get instance () {
    if (!this.connection) {
      this.connection = this.create()
    }

    return this.connection
  },

  get pool () {
    return this.instance
  },

  create () {
    const connection = knex(knexfile)

    return connection
  }
}

export = DB
