import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1787116148528 implements MigrationInterface {
  name = 'InitialSchema1787116148528';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_details" ADD "firebase_uid" character varying(128)`
    );
    await queryRunner.query(
      `ALTER TABLE "user_details" ADD CONSTRAINT "UQ_ba9c5d435e46bbdb5298d3ce6cb" UNIQUE ("firebase_uid")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_details" DROP CONSTRAINT "UQ_ba9c5d435e46bbdb5298d3ce6cb"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_details" DROP COLUMN "firebase_uid"`
    );
  }
}
