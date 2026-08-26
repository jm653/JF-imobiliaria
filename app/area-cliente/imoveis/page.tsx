import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShellCliente from "@/components/area/DashboardShellCliente";
import ImovelCardCliente from "@/components/area/ImovelCardCliente";

export default async function ImoveisClientePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel === "corretor") redirect("/area-corretor");

  const imoveis = await prisma.imovel.findMany({
    where: { status: "disponivel" },
    include: { corretor: { include: { usuario: true } } },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <DashboardShellCliente nome={session.user.name ?? ""}>
      <div className="mb-8">
        <p className="jf-kicker">Imóveis Disponíveis</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Navegue pelos anúncios
        </h1>
      </div>

      {!imoveis.length && (
        <div className="jf-panel rounded-lg p-6 font-body text-sm text-white/45">
          Nenhum imóvel disponível no momento.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {imoveis.map((imovel) => (
          <ImovelCardCliente
            key={imovel.id}
            id={imovel.id}
            titulo={imovel.titulo}
            cidade={imovel.cidade}
            bairro={imovel.bairro}
            valor={imovel.valor}
            quartos={imovel.quartos}
            banheiros={imovel.banheiros}
            vagas={imovel.vagas}
            areaM2={imovel.areaM2}
            garagem={imovel.garagem}
            fotos={imovel.fotos}
          />
        ))}
      </div>
    </DashboardShellCliente>
  );
}