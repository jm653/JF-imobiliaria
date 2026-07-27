import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShellCliente from "@/components/area/DashboardShellCliente";
import Link from "next/link";

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
          <Link
            key={imovel.id}
            href={`/area-cliente/imoveis/${imovel.id}`}
            className="jf-panel rounded-lg p-5 transition-colors hover:border-[#DAA520]/35"
          >
            <p className="font-display font-semibold text-white">
              {imovel.titulo}
            </p>
            <p className="mt-1 font-body text-sm text-white/50">
              {imovel.cidade}
              {imovel.bairro ? ` — ${imovel.bairro}` : ""}
            </p>
            <p className="mt-2 font-mono text-sm text-[#F4C95D]">
              R$ {imovel.valor.toLocaleString("pt-BR")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 font-body text-xs text-white/40">
              {imovel.quartos ? <span>{imovel.quartos} quartos</span> : null}
              {imovel.banheiros ? (
                <span>{imovel.banheiros} banheiros</span>
              ) : null}
              {imovel.garagem && <span>Garagem</span>}
            </div>
          </Link>
        ))}
      </div>
    </DashboardShellCliente>
  );
}