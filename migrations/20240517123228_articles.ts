import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('articles',(table:Knex.TableBuilder)=>{
        table.increments('id').primary()
        table.string('title',255).notNullable()
        table.text('body').notNullable()
        table.boolean('isApproved').notNullable().defaultTo(false)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('articles')
}

