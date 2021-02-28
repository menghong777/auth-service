import * as Knex from 'knex'

export async function up (knex: Knex) {
  // tslint:disable-next-line: await-promise
  await knex.schema.createTable('role_permission', table => {
    table.increments('id')
    table.integer('roleId').unsigned().references('id').inTable('role')
    table.integer('permissionId').unsigned().references('id').inTable('permission')
    table.dateTime('created').notNullable().defaultTo(knex.fn.now())
    table.dateTime('updated').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
  })
}

export async function down (knex: Knex) {
  // tslint:disable-next-line: await-promise
  await knex.schema.dropTable('role_permission')
}
