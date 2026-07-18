-- AlterTable
ALTER TABLE "desbloqueios" ADD COLUMN     "estagio" TEXT NOT NULL DEFAULT 'novo_lead';

-- CreateTable
CREATE TABLE "imoveis" (
    "id" TEXT NOT NULL,
    "corretorId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT,
    "valor" INTEGER NOT NULL,
    "quartos" INTEGER,
    "banheiros" INTEGER,
    "garagem" BOOLEAN NOT NULL DEFAULT false,
    "varanda" BOOLEAN NOT NULL DEFAULT false,
    "quintal" BOOLEAN NOT NULL DEFAULT false,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'disponivel',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imoveis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "perfis_corretor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
