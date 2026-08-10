import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1785821970819 implements MigrationInterface {
    name = 'InitialSchema1785821970819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" ADD "college_name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD "profile_image_path" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" DROP COLUMN "profile_image_path"`);
        await queryRunner.query(`ALTER TABLE "user_details" DROP COLUMN "college_name"`);
    }

}
