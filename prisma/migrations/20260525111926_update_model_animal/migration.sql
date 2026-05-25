/*
  Warnings:

  - You are about to drop the column `especie` on the `Animal` table. All the data in the column will be lost.
  - Added the required column `chip` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cor` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataNascimento` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foto` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pelagem` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peso` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `raca` to the `Animal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sexo` to the `Animal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Adotante" ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "especie",
ADD COLUMN     "chip" BOOLEAN NOT NULL,
ADD COLUMN     "cor" TEXT NOT NULL,
ADD COLUMN     "dataNascimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "foto" TEXT NOT NULL,
ADD COLUMN     "pelagem" TEXT NOT NULL,
ADD COLUMN     "peso" DECIMAL(3,2) NOT NULL,
ADD COLUMN     "raca" TEXT NOT NULL,
ADD COLUMN     "sexo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vet" ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Voluntario" ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
