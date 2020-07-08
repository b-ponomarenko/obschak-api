import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeTypeRealToDoublePrecision1594239039488 implements MigrationInterface {
    name = 'ChangeTypeRealToDoublePrecision1594239039488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" ALTER COLUMN "value" TYPE DOUBLE PRECISION`);
        await queryRunner.query(`ALTER TABLE "transfers" ALTER COLUMN "value" TYPE DOUBLE PRECISION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" ALTER COLUMN "value" TYPE REAL`);
        await queryRunner.query(`ALTER TABLE "transfers" ALTER COLUMN "value" TYPE REAL`);
    }

}
