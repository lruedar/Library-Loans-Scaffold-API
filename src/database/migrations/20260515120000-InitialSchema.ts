/* eslint-disable prettier/prettier */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema20260515120000 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE TYPE "user_role_enum"
            AS ENUM ('admin', 'member', 'librarian')
        `);

        await queryRunner.query(`
            CREATE TYPE "loan_status_enum"
            AS ENUM ('active', 'returned', 'overdue')
        `);

        await queryRunner.query(`
            CREATE TYPE "item_type_enum"
            AS ENUM ('book', 'magazine', 'equipment')
        `);

        await queryRunner.query(`
            CREATE TABLE "users" (
                "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "email"         VARCHAR(255) NOT NULL,
                "passwordHash"  VARCHAR(255) NOT NULL,
                "firstName"     VARCHAR(100) NOT NULL,
                "lastName"      VARCHAR(100) NOT NULL,
                "role"          "user_role_enum" NOT NULL DEFAULT 'member',
                "isActive"      BOOLEAN NOT NULL DEFAULT true,
                "createdAt"     TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt"     TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_users_email"
            ON "users" ("email")
        `);

        await queryRunner.query(`
            CREATE TABLE "refresh_tokens" (
                "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "userId"     UUID NOT NULL,
                "token"      VARCHAR(512) NOT NULL,
                "expiresAt"  TIMESTAMPTZ NOT NULL,
                "revokedAt"  TIMESTAMPTZ,
                "createdAt"  TIMESTAMP NOT NULL DEFAULT now(),

                CONSTRAINT "FK_refresh_tokens_user"
                    FOREIGN KEY ("userId")
                    REFERENCES "users"("id")
                    ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_refresh_tokens_token"
            ON "refresh_tokens" ("token")
        `);

        await queryRunner.query(`
            CREATE TABLE "items" (
                "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "code"       VARCHAR(32) NOT NULL,
                "title"      VARCHAR(255) NOT NULL,
                "type"       "item_type_enum" NOT NULL DEFAULT 'book',
                "isActive"   BOOLEAN NOT NULL DEFAULT true,
                "createdAt"  TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt"  TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE UNIQUE INDEX "UQ_items_code"
            ON "items" ("code")
        `);

        await queryRunner.query(`
            CREATE TABLE "loans" (
                "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                "userId"       UUID NOT NULL,
                "itemId"       UUID NOT NULL,
                "borrowedAt"   TIMESTAMP NOT NULL,
                "dueDate"      TIMESTAMP NOT NULL,
                "returnedAt"   TIMESTAMP,
                "status"       "loan_status_enum" NOT NULL DEFAULT 'active',
                "fineAmount"   NUMERIC(10,2) NOT NULL DEFAULT 0,
                "createdAt"    TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt"    TIMESTAMP NOT NULL DEFAULT now(),

                CONSTRAINT "FK_loans_user"
                    FOREIGN KEY ("userId")
                    REFERENCES "users"("id")
                    ON DELETE RESTRICT,

                CONSTRAINT "FK_loans_item"
                    FOREIGN KEY ("itemId")
                    REFERENCES "items"("id")
                    ON DELETE RESTRICT
            )
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_loans_userId_status"
            ON "loans" ("userId", "status")
        `);
    }

    async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            DROP INDEX "IDX_loans_userId_status"
        `);

        await queryRunner.query(`
            DROP TABLE "loans"
        `);

        await queryRunner.query(`
            DROP INDEX "UQ_items_code"
        `);

        await queryRunner.query(`
            DROP TABLE "items"
        `);

        await queryRunner.query(`
            DROP INDEX "UQ_refresh_tokens_token"
        `);

        await queryRunner.query(`
            DROP TABLE "refresh_tokens"
        `);

        await queryRunner.query(`
            DROP INDEX "UQ_users_email"
        `);

        await queryRunner.query(`
            DROP TABLE "users"
        `);

        await queryRunner.query(`
            DROP TYPE "item_type_enum"
        `);

        await queryRunner.query(`
            DROP TYPE "loan_status_enum"
        `);

        await queryRunner.query(`
            DROP TYPE "user_role_enum"
        `);
    }
}