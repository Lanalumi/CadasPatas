-- CreateTable
CREATE TABLE "Voluntario" (
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
    "dataInscricao" TIMESTAMP(3) NOT NULL,
    "dataSaida" TIMESTAMP(3),
    "senha" TEXT NOT NULL,

    CONSTRAINT "Voluntario_pkey" PRIMARY KEY ("id")
);
