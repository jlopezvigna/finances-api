import { Migration } from '@mikro-orm/migrations';

export class Migration20201229000515 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "bill" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "title" text not null, "amount" int4 not null);');
  }

}
