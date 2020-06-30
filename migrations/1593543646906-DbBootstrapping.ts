import {MigrationInterface, QueryRunner} from "typeorm";

export class DbBootstrapping1593543646906 implements MigrationInterface {
    name = 'DbBootstrapping1593543646906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "purchases" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "value" real NOT NULL, "currency" character varying NOT NULL, "creatorId" integer NOT NULL, "date" TIMESTAMP NOT NULL, "participants" json NOT NULL, "receipts" json NOT NULL DEFAULT '[]', "eventId" integer, CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "transfers" ("id" SERIAL NOT NULL, "from" integer NOT NULL, "to" integer NOT NULL, "value" real NOT NULL, "currency" character varying NOT NULL, "eventId" integer, CONSTRAINT "PK_f712e908b465e0085b4408cabc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "photo" character varying, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "creatorId" integer NOT NULL, "users" json NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "FK_550b7fc9227dbf1d2d4066db30d" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_eb71af88ed4b0bedc5895a5c52d" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_eb71af88ed4b0bedc5895a5c52d"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "FK_550b7fc9227dbf1d2d4066db30d"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "transfers"`);
        await queryRunner.query(`DROP TABLE "purchases"`);
    }

}
