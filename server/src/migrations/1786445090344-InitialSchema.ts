import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1786445090344 implements MigrationInterface {
  name = 'InitialSchema1786445090344';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "results" DROP CONSTRAINT "FK_14692d0f6cd2551c499a14714e3"`
    );
    await queryRunner.query(
      `ALTER TABLE "results" ADD CONSTRAINT "FK_14692d0f6cd2551c499a14714e3" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("quiz_id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "results" DROP CONSTRAINT "FK_14692d0f6cd2551c499a14714e3"`
    );
    await queryRunner.query(
      `ALTER TABLE "results" ADD CONSTRAINT "FK_14692d0f6cd2551c499a14714e3" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("quiz_id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
