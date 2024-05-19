import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('comments',(table:Knex.TableBuilder)=>{
        table.increments('id').primary()
        table.integer('article_id').unsigned().references('id').inTable('articles').onDelete('CASCADE').onUpdate('CASCADE');
        table.string('description',255).notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('comments');
}

