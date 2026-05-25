-- CreateTable
CREATE TABLE "Vet" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "telefone" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "bairro" TEXT NOT NULL,
    "especializacao" TEXT NOT NULL,
    "crmvNum" TEXT NOT NULL,
    "crmvUf" TEXT NOT NULL,

    CONSTRAINT "Vet_pkey" PRIMARY KEY ("id")
);
