-- CreateTable
CREATE TABLE "pedidos_imovel" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "bairro" TEXT,
    "valorMaximo" INTEGER NOT NULL,
    "quartos" INTEGER,
    "banheiros" INTEGER,
    "garagem" BOOLEAN NOT NULL DEFAULT false,
    "varanda" BOOLEAN NOT NULL DEFAULT false,
    "quintal" BOOLEAN NOT NULL DEFAULT false,
    "aceitaPet" BOOLEAN NOT NULL DEFAULT false,
    "aceitaFinanciamento" BOOLEAN NOT NULL DEFAULT false,
    "descricaoLivre" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_imovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "desbloqueios" (
    "id" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "corretorId" TEXT NOT NULL,
    "creditosGastos" INTEGER NOT NULL DEFAULT 10,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "desbloqueios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "desbloqueios_pedidoId_corretorId_key" ON "desbloqueios"("pedidoId", "corretorId");

-- AddForeignKey
ALTER TABLE "pedidos_imovel" ADD CONSTRAINT "pedidos_imovel_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "perfis_cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "desbloqueios" ADD CONSTRAINT "desbloqueios_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedidos_imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "desbloqueios" ADD CONSTRAINT "desbloqueios_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "perfis_corretor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
