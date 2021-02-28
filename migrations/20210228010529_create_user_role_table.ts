import * as Knex from 'knex'

export async function up (knex: Knex) {
  // tslint:disable-next-line: await-promise
  await knex.schema.createTable('user_role', table => {
    table.increments('id')
    table.integer('userId').unsigned().index()
    table.integer('roleId').unsigned().index()
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })
}

export async function down (knex: Knex) {
  // tslint:disable-next-line: await-promise
  await knex.schema.dropTable('user_role')
}
