import * as Knex from 'knex'

export async function up (knex: Knex) {
  // tslint:disable-next-line: await-promise
  await knex.schema.createTable('role', table => {
    table.increments('id')
    table.string('title')
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })
}

export async function down (knex: Knex) {
  // tslint:disable-next-line: await-promise
  await knex.schema.dropTable('role')
}
