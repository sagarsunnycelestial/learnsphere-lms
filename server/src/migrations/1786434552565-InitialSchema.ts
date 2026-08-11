import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1786434552565 implements MigrationInterface {
    name = 'InitialSchema1786434552565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "PK_09f4c8130b54f35925588a37b6a" PRIMARY KEY ("role_id")`);
        await queryRunner.query(`ALTER TABLE "roles" ADD CONSTRAINT "UQ_ac35f51a0f17e3e1fe121126039" UNIQUE ("role_name")`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "PK_738fd696873afdde0c2ee567a01" PRIMARY KEY ("lesson_id")`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "PK_7817b5daaf3297d3c83cfeb3674" PRIMARY KEY ("option_id")`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "PK_8e940ecc478000e09fa8b008ec6" PRIMARY KEY ("question_id")`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "UQ_0ec96305bea4f106c62138d3249" UNIQUE ("correct_option_id")`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "PK_3c8f50c2bb1131ae2acc86bb48e" PRIMARY KEY ("result_id")`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD CONSTRAINT "PK_60297c025ebf9e8041064eeca41" PRIMARY KEY ("quiz_id")`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "PK_3e9102cadbf8e3aaabc5acc6042" PRIMARY KEY ("enrollment_id")`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "PK_42dc69837b2e7bc603686ddaf53" PRIMARY KEY ("course_id")`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD CONSTRAINT "PK_ef1a1915f99bcf7a87049f74494" PRIMARY KEY ("user_id")`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD CONSTRAINT "UQ_4140728ad7094a2f70267d7b52b" UNIQUE ("username")`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD CONSTRAINT "UQ_34071c8003531ced970246523e4" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "UQ_647c6bda9ead37b702421710fde" UNIQUE ("user_id", "course_id")`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "FK_3c4e299cf8ed04093935e2e22fe" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "FK_2bdd03245b8cb040130fe16f21d" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_46b3c125e02f7242662e4ccb307" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("quiz_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_0ec96305bea4f106c62138d3249" FOREIGN KEY ("correct_option_id") REFERENCES "options"("option_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "FK_08b8f644e3b243fe8cb8c7498e8" FOREIGN KEY ("user_id") REFERENCES "user_details"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "FK_14692d0f6cd2551c499a14714e3" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("quiz_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD CONSTRAINT "FK_e460dcb813c2cc28c93c95f2504" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_ff997f5a39cd24a491b9aca45c9" FOREIGN KEY ("user_id") REFERENCES "user_details"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_b79d0bf01779fdf9cfb6b092af3" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_16fcd8ab8bc042688984d5b3934" FOREIGN KEY ("created_by") REFERENCES "user_details"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD CONSTRAINT "FK_79823d31f1689baf869d2b529c8" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" DROP CONSTRAINT "FK_79823d31f1689baf869d2b529c8"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_16fcd8ab8bc042688984d5b3934"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_b79d0bf01779fdf9cfb6b092af3"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_ff997f5a39cd24a491b9aca45c9"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP CONSTRAINT "FK_e460dcb813c2cc28c93c95f2504"`);
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "FK_14692d0f6cd2551c499a14714e3"`);
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "FK_08b8f644e3b243fe8cb8c7498e8"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_0ec96305bea4f106c62138d3249"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_46b3c125e02f7242662e4ccb307"`);
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "FK_2bdd03245b8cb040130fe16f21d"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "FK_3c4e299cf8ed04093935e2e22fe"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "UQ_647c6bda9ead37b702421710fde"`);
        await queryRunner.query(`ALTER TABLE "user_details" DROP CONSTRAINT "UQ_34071c8003531ced970246523e4"`);
        await queryRunner.query(`ALTER TABLE "user_details" DROP CONSTRAINT "UQ_4140728ad7094a2f70267d7b52b"`);
        await queryRunner.query(`ALTER TABLE "user_details" DROP CONSTRAINT "PK_ef1a1915f99bcf7a87049f74494"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "PK_42dc69837b2e7bc603686ddaf53"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "PK_3e9102cadbf8e3aaabc5acc6042"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP CONSTRAINT "PK_60297c025ebf9e8041064eeca41"`);
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "PK_3c8f50c2bb1131ae2acc86bb48e"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "UQ_0ec96305bea4f106c62138d3249"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "PK_8e940ecc478000e09fa8b008ec6"`);
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "PK_7817b5daaf3297d3c83cfeb3674"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "PK_738fd696873afdde0c2ee567a01"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "UQ_ac35f51a0f17e3e1fe121126039"`);
        await queryRunner.query(`ALTER TABLE "roles" DROP CONSTRAINT "PK_09f4c8130b54f35925588a37b6a"`);
    }

}
