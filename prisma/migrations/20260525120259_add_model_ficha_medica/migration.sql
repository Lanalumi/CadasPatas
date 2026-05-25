-- CreateTable
CREATE TABLE "FichaMedica" (
    "id" TEXT NOT NULL,
    "consultaId" TEXT NOT NULL,
    "castracao" BOOLEAN NOT NULL,
    "vermifucacao" BOOLEAN NOT NULL,
    "vacina" BOOLEAN NOT NULL,

    CONSTRAINT "FichaMedica_pkey" PRIMARY KEY ("id")
);
