import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";
import CartaoPipeline from "@/components/area/CartaoPipeline";

const ESTAGIOS = [
  { id: "novo_lead", label: "Novo Lead" },
  { id: "contato_realizado", label: "Contato Realizado" },
  { id: "conversa", label: "Conversa" },
  { id: "visita_agendada", label: "Visita Agendada" },
  { id: "visita_realizada", label: "Visita Realizada" },
  { id: "proposta", label: "Proposta" },
  { id: "negociacao", label: "Negociação" },
  { id: "contrato", label: "Contrato" },
  { id: "concluido", label: "Concluído" },
];

export default async function PipelinePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel !== "corretor") redirect("/area-cliente");

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
    include: {
      desbloqueios: {
        include: {
          pedido: { include: { cliente: { include: { usuario: true } } } },
        },
        orderBy: { criadoEm: "desc" },
      },
    },
  });

  const desbloqueios = perfilCorretor?.desbloqueios ?? [];

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <div className="mb-8">
        <p className="jf-kicker">Pipeline</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Funil de negociações
        </h1>
        <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-white/50">
          Organize os contatos desbloqueados e acompanhe o avanço de cada
          oportunidade até o fechamento.
        </p>
      </div>

      {!desbloqueios.length && (
        <div className="jf-panel rounded-lg p-6 font-body text-sm text-white/45">
          Nenhum contato desbloqueado ainda. Desbloqueie uma oportunidade para
          iniciar seu pipeline.
        </div>
      )}

      <div className="grid gap-3 overflow-x-auto pb-3 xl:grid-cols-3 2xl:grid-cols-4">
        {ESTAGIOS.map((estagio, indice) => {
          const itens = desbloqueios.filter((d) => d.estagio === estagio.id);
          const anterior = ESTAGIOS[indice - 1]?.id ?? null;
          const proximo = ESTAGIOS[indice + 1]?.id ?? null;

          return (
            <section
              key={estagio.id}
              className="jf-panel min-h-40 min-w-72 rounded-lg p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-body text-sm font-semibold text-white">
                  {estagio.label}
                </h2>
                <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[11px] text-white/40">
                  {itens.length}
                </span>
              </div>

              <div className="space-y-2">
                {itens.map((item) => (
                  <CartaoPipeline
                    key={item.id}
                    desbloqueioId={item.id}
                    nomeCliente={item.pedido.cliente.usuario.nome}
                    cidade={item.pedido.cidade}
                    valorMaximo={item.pedido.valorMaximo}
                    estagioAtual={item.estagio}
                    estagioAnterior={anterior}
                    proximoEstagio={proximo}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </DashboardShell>
  );
}
