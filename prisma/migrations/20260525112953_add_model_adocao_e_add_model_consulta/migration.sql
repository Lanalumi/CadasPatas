-- CreateTable
CREATE TABLE "Adocao" (
    "id" TEXT NOT NULL,
    "adotanteId" TEXT NOT NULL,
    "animalId" TEXT NOT NULL,
    "dataAdocao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Adocao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL,
    "ID_Veterinario" TEXT NOT NULL,
    "ID_Animal" TEXT NOT NULL,
    "motivo" VARCHAR(20) NOT NULL,
    "observacao" VARCHAR(100) NOT NULL,
    "prescricao" VARCHAR(100) NOT NULL,
    "data_atendimento" DATE NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Adocao" ADD CONSTRAINT "Adocao_adotanteId_fkey" FOREIGN KEY ("adotanteId") REFERENCES "Adotante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Adocao" ADD CONSTRAINT "Adocao_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_ID_Veterinario_fkey" FOREIGN KEY ("ID_Veterinario") REFERENCES "Vet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_ID_Animal_fkey" FOREIGN KEY ("ID_Animal") REFERENCES "Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
