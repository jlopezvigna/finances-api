import { MigrationInterface, QueryRunner } from "typeorm";

export class FakeBills1610654710370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    insert into bill (id, title, amount, period, "categoryId") values (1, 'Community Outreach Specialist', 87, '12/30/2020', 2);
insert into bill (id, title, amount, period, "categoryId") values (2, 'Nuclear Power Engineer', 47, '2/3/2020', 1);
insert into bill (id, title, amount, period, "categoryId") values (3, 'Chemical Engineer', 89, '11/16/2020', 1);
insert into bill (id, title, amount, period, "categoryId") values (4, 'Administrative Officer', 31, '9/17/2020', 1);
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
