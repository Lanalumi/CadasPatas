/*
  Warnings:

  - Added the required column `especie` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Animal" ADD COLUMN     "especie" TEXT NOT NULL;
