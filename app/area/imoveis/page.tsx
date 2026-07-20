import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";
import NovoImovelForm from "@/components/area/NovoImovelForm";
import BotaoRemoverImovel from "@/components/area/BotaoRemoverImovel";

export default async function ImoveisPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel !== "corretor") redirect("/area-cliente");

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
    include: {
      imoveis: { orderBy: { criadoEm: "desc" } },
    },
  });

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <div className="mb-8">
        <p className="jf-kicker">Imóveis</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Seus anúncios
        </h1>
        <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-white/50">
          Cadastre os imóveis que você tem disponível — eles ficam prontos
          pra quando a IA cruzar com pedidos compatíveis.
        </p>
      </div>

      <div className="jf-panel mb-8 rounded-lg p-6">
        <NovoImovelForm />
      </div>

      {!perfilCorretor?.imoveis.length && (
        <div className="jf-panel rounded-lg p-6 font-body text-sm text-white/45">
          Você ainda não anunciou nenhum imóvel.
        </div>
      )}

      <div className="grid gap-3">
        {perfilCorretor?.imoveis.map((imovel) => (
          <article
            key={imovel.id}
            className="jf-panel rounded-lg p-5 transition-colors hover:border-[#DAA520]/35"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-display text-lg font-semibold text-white">
                  {imovel.titulo}
                </h3>
                <p className="mt-1 font-body text-sm text-white/52">
                  {imovel.cidade}
                  {imovel.bairro ? ` — ${imovel.bairro}` : ""} · R${" "}
                  {imovel.valor.toLocaleString("pt-BR")}
                  {imovel.quartos ? ` · ${imovel.quartos} quartos` : ""}
                  {imovel.banheiros ? ` · ${imovel.banheiros} banheiros` : ""}
                </p>

                <div className="mt-2 flex flex-wrap gap-2 font-body text-xs text-white/42">
                  {imovel.garagem && <span>Garagem</span>}
                  {imovel.varanda && <span>Varanda</span>}
                  {imovel.quintal && <span>Quintal</span>}
                </div>

                {imovel.descricao && (
                  <p className="mt-3 font-body text-sm italic leading-6 text-white/58">
                    &quot;{imovel.descricao}&quot;
                  </p>
                )}
              </div>
              <BotaoRemoverImovel imovelId={imovel.id} />
            </div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}