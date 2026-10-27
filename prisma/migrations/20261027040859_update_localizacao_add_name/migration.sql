/*
  Warnings:

  - Added the required column `nome` to the `Localizacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Localizacao" ADD COLUMN     "nome" TEXT NOT NULL;
