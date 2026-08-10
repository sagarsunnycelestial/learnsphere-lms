import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1785819298187 implements MigrationInterface {
    name = 'InitialSchema1785819298187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("role_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_name" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ac35f51a0f17e3e1fe121126039" UNIQUE ("role_name"), CONSTRAINT "PK_09f4c8130b54f35925588a37b6a" PRIMARY KEY ("role_id"))`);
        await queryRunner.query(`CREATE TABLE "lessons" ("lesson_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text, "video_link" text, "sort_order" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "course_id" uuid, CONSTRAINT "PK_738fd696873afdde0c2ee567a01" PRIMARY KEY ("lesson_id"))`);
        await queryRunner.query(`CREATE TABLE "options" ("option_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "option_text" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "question_id" uuid, CONSTRAINT "PK_7817b5daaf3297d3c83cfeb3674" PRIMARY KEY ("option_id"))`);
        await queryRunner.query(`CREATE TABLE "questions" ("question_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question_text" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "quiz_id" uuid, "correct_option_id" uuid, CONSTRAINT "REL_0ec96305bea4f106c62138d324" UNIQUE ("correct_option_id"), CONSTRAINT "PK_8e940ecc478000e09fa8b008ec6" PRIMARY KEY ("question_id"))`);
        await queryRunner.query(`CREATE TABLE "results" ("result_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "score" numeric(5,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, "quiz_id" uuid, CONSTRAINT "PK_3c8f50c2bb1131ae2acc86bb48e" PRIMARY KEY ("result_id"))`);
        await queryRunner.query(`CREATE TABLE "quizzes" ("quiz_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quiz_name" text NOT NULL, "deactivated_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "course_id" uuid, CONSTRAINT "PK_60297c025ebf9e8041064eeca41" PRIMARY KEY ("quiz_id"))`);
        await queryRunner.query(`CREATE TABLE "courses" ("course_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "course_name" text NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "deactivated_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" uuid, CONSTRAINT "PK_42dc69837b2e7bc603686ddaf53" PRIMARY KEY ("course_id"))`);
        await queryRunner.query(`CREATE TABLE "user_details" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" text NOT NULL, "email" text NOT NULL, "password_hash" character varying(255) NOT NULL, "refresh_token" text, "last_login_at" TIMESTAMP, "is_active" boolean NOT NULL DEFAULT true, "deactivated_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "role_id" uuid, CONSTRAINT "UQ_4140728ad7094a2f70267d7b52b" UNIQUE ("username"), CONSTRAINT "UQ_34071c8003531ced970246523e4" UNIQUE ("email"), CONSTRAINT "PK_ef1a1915f99bcf7a87049f74494" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "FK_3c4e299cf8ed04093935e2e22fe" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "FK_2bdd03245b8cb040130fe16f21d" FOREIGN KEY ("question_id") REFERENCES "questions"("question_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_46b3c125e02f7242662e4ccb307" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("quiz_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_0ec96305bea4f106c62138d3249" FOREIGN KEY ("correct_option_id") REFERENCES "options"("option_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "FK_08b8f644e3b243fe8cb8c7498e8" FOREIGN KEY ("user_id") REFERENCES "user_details"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "results" ADD CONSTRAINT "FK_14692d0f6cd2551c499a14714e3" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("quiz_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD CONSTRAINT "FK_e460dcb813c2cc28c93c95f2504" FOREIGN KEY ("course_id") REFERENCES "courses"("course_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_16fcd8ab8bc042688984d5b3934" FOREIGN KEY ("created_by") REFERENCES "user_details"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_details" ADD CONSTRAINT "FK_79823d31f1689baf869d2b529c8" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_details" DROP CONSTRAINT "FK_79823d31f1689baf869d2b529c8"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_16fcd8ab8bc042688984d5b3934"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP CONSTRAINT "FK_e460dcb813c2cc28c93c95f2504"`);
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "FK_14692d0f6cd2551c499a14714e3"`);
        await queryRunner.query(`ALTER TABLE "results" DROP CONSTRAINT "FK_08b8f644e3b243fe8cb8c7498e8"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_0ec96305bea4f106c62138d3249"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_46b3c125e02f7242662e4ccb307"`);
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "FK_2bdd03245b8cb040130fe16f21d"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "FK_3c4e299cf8ed04093935e2e22fe"`);
        await queryRunner.query(`DROP TABLE "user_details"`);
        await queryRunner.query(`DROP TABLE "courses"`);
        await queryRunner.query(`DROP TABLE "quizzes"`);
        await queryRunner.query(`DROP TABLE "results"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TABLE "options"`);
        await queryRunner.query(`DROP TABLE "lessons"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
