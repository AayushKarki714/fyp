/*
  Warnings:

  - Added the required column `role` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'LANCER', 'CLIENT');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "role" "Role" NOT NULL;
