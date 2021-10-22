import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Teams extends BaseSchema {
  protected tableName = 'teams'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('name').unique().alter()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('name').alter()
    })
  }
}
