/*
  Warnings:

  - The primary key for the `Adocao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `adotanteId` on the `Adocao` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Adocao` table. All the data in the column will be lost.
  - You are about to drop the column `chip` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `Animal` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes` on the `Animal` table. All the data in the column will be lost.
  - The `sexo` column on the `Animal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `criadoEm` on the `Clinica` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Clinica` table. All the data in the column will be lost.
  - You are about to drop the column `ID_Animal` on the `Consulta` table. All the data in the column will be lost.
  - You are about to drop the column `ID_Veterinario` on the `Consulta` table. All the data in the column will be lost.
  - You are about to drop the column `data_atendimento` on the `Consulta` table. All the data in the column will be lost.
  - You are about to drop the column `motivo` on the `Consulta` table. All the data in the column will be lost.
  - You are about to drop the column `prescricao` on the `Consulta` table. All the data in the column will be lost.
  - You are about to drop the `Adotante` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FichaMedica` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Voluntario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pessoaId` to the `Adocao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cnpj` to the `Clinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `animalId` to the `Consulta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clinicaId` to the `Consulta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataAtendimento` to the `Consulta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motivoId` to the `Consulta` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Adocao" DROP CONSTRAINT "Adocao_adotanteId_fkey";

-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_ID_Animal_fkey";

-- DropForeignKey
ALTER TABLE "Consulta" DROP CONSTRAINT "Consulta_ID_Veterinario_fkey";

-- AlterTable
ALTER TABLE "Adocao" DROP CONSTRAINT "Adocao_pkey",
DROP COLUMN "adotanteId",
DROP COLUMN "id",
ADD COLUMN     "pessoaId" TEXT NOT NULL,
ADD CONSTRAINT "Adocao_pkey" PRIMARY KEY ("pessoaId", "animalId");

-- AlterTable
ALTER TABLE "Animal" DROP COLUMN "chip",
DROP COLUMN "criadoEm",
DROP COLUMN "observacoes",
ADD COLUMN     "fivFelv" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "motivoSaida" TEXT,
ALTER COLUMN "dataNascimento" DROP NOT NULL,
DROP COLUMN "sexo",
ADD COLUMN     "sexo" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "dataChegada" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Clinica" DROP COLUMN "criadoEm",
DROP COLUMN "email",
ADD COLUMN     "cnpj" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Consulta" DROP COLUMN "ID_Animal",
DROP COLUMN "ID_Veterinario",
DROP COLUMN "data_atendimento",
DROP COLUMN "motivo",
DROP COLUMN "prescricao",
ADD COLUMN     "animalId" TEXT NOT NULL,
ADD COLUMN     "clinicaId" TEXT NOT NULL,
ADD COLUMN     "dataAtendimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataRetorno" TIMESTAMP(3),
ADD COLUMN     "motivoId" TEXT NOT NULL,
ALTER COLUMN "observacao" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Adotante";

-- DropTable
DROP TABLE "FichaMedica";

-- DropTable
DROP TABLE "Vet";

-- DropTable
DROP TABLE "Voluntario";

-- CreateTable
CREATE TABLE "TipoPessoa" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "TipoPessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pessoa" (
    "id" TEXT NOT NULL,
    "tipoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "telefone" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "bairro" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataSaida" TIMESTAMP(3),

    CONSTRAINT "Pessoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Localizacao" (
    "id" TEXT NOT NULL,
    "tipoLocal" TEXT NOT NULL,

    CONSTRAINT "Localizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoLocalizacao" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "localizacaoId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dataEntrada" TIMESTAMP(3) NOT NULL,
    "dataSaida" TIMESTAMP(3),

    CONSTRAINT "HistoricoLocalizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peso" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "quantidadePeso" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Peso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoPeso" (
    "id" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "pesoId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dataPesagem" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HistoricoPeso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motivo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Motivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicamento" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Medicamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescreve" (
    "id" TEXT NOT NULL,
    "consultaId" TEXT NOT NULL,
    "medicamentoId" TEXT NOT NULL,
    "dosagem" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "frequencia" TEXT NOT NULL,
    "duracaoTratamento" TEXT NOT NULL,

    CONSTRAINT "Prescreve_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pessoa" ADD CONSTRAINT "Pessoa_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoPessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adocao" ADD CONSTRAINT "Adocao_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "Pessoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoLocalizacao" ADD CONSTRAINT "HistoricoLocalizacao_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoLocalizacao" ADD CONSTRAINT "HistoricoLocalizacao_localizacaoId_fkey" FOREIGN KEY ("localizacaoId") REFERENCES "Localizacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peso" ADD CONSTRAINT "Peso_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoPeso" ADD CONSTRAINT "HistoricoPeso_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoPeso" ADD CONSTRAINT "HistoricoPeso_pesoId_fkey" FOREIGN KEY ("pesoId") REFERENCES "Peso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_motivoId_fkey" FOREIGN KEY ("motivoId") REFERENCES "Motivo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescreve" ADD CONSTRAINT "Prescreve_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescreve" ADD CONSTRAINT "Prescreve_medicamentoId_fkey" FOREIGN KEY ("medicamentoId") REFERENCES "Medicamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
