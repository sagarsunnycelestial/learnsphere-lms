import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1786010375227 implements MigrationInterface {
  name = 'InitialSchema1786010375227';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lessons" ADD "lesson_name" text DEFAULT 'Lesson'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lessons" DROP COLUMN "lesson_name"`);
  }
}
