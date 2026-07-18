import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";
import DesbloquearBotao from "@/components/area/DesbloquearBotao";
import {
  ArrowUpRight,
  Coins,
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  Unlock,
} from "lucide-react";
import Link from "next/link";

function compatibilidadeEstimada(id: string, indice: number) {
  const base = id.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  return 82 + ((base + indice * 7) % 17);
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR");
}

export default async function AreaCorretor() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel !== "corretor") redirect("/area-cliente");

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
    include: { desbloqueios: true },
  });

  const pedidos = await prisma.pedidoImovel.findMany({
    where: { status: "ativo" },
    include: { cliente: { include: { usuario: true } } },
    orderBy: { criadoEm: "desc" },
  });

  const idsDesbloqueados = new Set(
    perfilCorretor?.desbloqueios.map((d) => d.pedidoId) ?? []
  );

  const pedidosDisponiveis = pedidos.filter(
    (p) => !idsDesbloqueados.has(p.id)
  );
  const pedidosDesbloqueados = pedidos.filter((p) => idsDesbloqueados.has(p.id));
  const primeiroNome = session.user.name?.split(" ")[0] ?? "";
  const creditos = perfilCorretor?.creditos ?? 0;
  const score = perfilCorretor?.score ?? 0;

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <div className="mb-8 grid gap-4 xl:grid-cols-[1fr_22rem]">
        <section className="jf-panel-strong rounded-lg p-6">
          <p className="jf-kicker">Centro de comando</p>
          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-white sm:text-4xl">
                Bom dia, {primeiroNome}
              </h1>
              <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-white/62">
                A IA encontrou {pedidosDisponiveis.length} oportunidade(s) ativa(s)
                para analisar hoje. Priorize os matches mais altos e transforme
                desbloqueios em conversas.
              </p>
            </div>
            <Link
              href="/area/pipeline"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2.5 font-body text-sm font-semibold text-white/80 transition-colors hover:border-[#DAA520]/45 hover:text-[#F4C95D]"
            >
              Ver pipeline
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>

        <aside className="jf-panel rounded-lg p-5">
          <div className="flex items-center gap-2 text-[#F4C95D]">
            <Sparkles size={18} />
            <p className="font-body text-sm font-semibold">Pulso da IA</p>
          </div>
          <p className="mt-3 font-body text-sm leading-6 text-white/58">
            {pedidosDisponiveis.length
              ? "Existem clientes com intenção clara de compra. O melhor próximo passo é desbloquear os contatos com maior compatibilidade."
              : "Nenhuma oportunidade nova agora. Revise seus clientes desbloqueados e avance conversas no pipeline."}
          </p>
        </aside>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Créditos", valor: creditos, icon: Coins },
          { label: "Oportunidades", valor: pedidosDisponiveis.length, icon: Target },
          { label: "Contatos", valor: idsDesbloqueados.size, icon: Unlock },
          { label: "Score", valor: score.toFixed(0), icon: TrendingUp },
        ].map((item) => {
          const Icone = item.icon;
          return (
            <div key={item.label} className="jf-panel rounded-lg p-4">
              <Icone className="mb-3 text-[#DAA520]" size={19} />
              <p className="font-display text-2xl font-bold text-white">
                {item.valor}
              </p>
              <p className="mt-1 font-body text-xs text-white/45">{item.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="jf-kicker">Radar de oportunidades</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-white">
            Clientes procurando imóveis agora
          </h2>
        </div>
        <Link
          href="/area/creditos"
          className="hidden rounded-full border border-[#DAA520]/30 px-4 py-2 font-body text-sm text-[#F4C95D] transition-colors hover:bg-[#DAA520]/10 sm:inline-flex"
        >
          Gerenciar créditos
        </Link>
      </div>

      {!pedidos.length && (
        <p className="font-body text-sm text-white/40">
          Nenhum pedido publicado ainda.
        </p>
      )}

      <div className="grid gap-3">
        {pedidos.map((pedido, indice) => {
          const desbloqueado = idsDesbloqueados.has(pedido.id);
          const compatibilidade = compatibilidadeEstimada(pedido.id, indice);
          const telefoneLimpo = pedido.cliente.usuario.telefone?.replace(/\D/g, "");

          return (
            <article
              key={pedido.id}
              className="jf-panel rounded-lg p-5 transition-colors hover:border-[#DAA520]/35"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="jf-chip rounded-full px-2.5 py-1 font-mono text-[11px]">
                      {compatibilidade}% match
                    </span>
                    {desbloqueado && (
                      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 font-mono text-[11px] text-emerald-200">
                        contato liberado
                      </span>
                    )}
                  </div>

                  <h3 className="mt-3 font-display text-lg font-semibold text-white">
                    {pedido.cidade}
                    {pedido.bairro ? ` — ${pedido.bairro}` : ""}
                  </h3>
                  <p className="mt-1 font-body text-sm text-white/52">
                    Até R$ {formatarMoeda(pedido.valorMaximo)}
                    {pedido.quartos ? ` · ${pedido.quartos} quartos` : ""}
                    {pedido.banheiros ? ` · ${pedido.banheiros} banheiros` : ""}
                  </p>

                  <div className="mt-3 flex max-w-sm items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/7">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#DAA520] to-[#F4C95D]"
                        style={{ width: `${compatibilidade}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-white/40">
                      IA
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 font-body text-xs text-white/42">
                    {pedido.garagem && <span>Garagem</span>}
                    {pedido.varanda && <span>Varanda</span>}
                    {pedido.quintal && <span>Quintal</span>}
                    {pedido.aceitaPet && <span>Aceita pet</span>}
                    {pedido.aceitaFinanciamento && <span>Financiamento</span>}
                  </div>

                  {pedido.descricaoLivre && (
                    <p className="mt-3 max-w-3xl font-body text-sm italic leading-6 text-white/58">
                      &quot;{pedido.descricaoLivre}&quot;
                    </p>
                  )}
                </div>

                <div className="w-full shrink-0 lg:w-64">
                  {desbloqueado ? (
                    <div className="space-y-3">
                      <div className="rounded-lg border border-[#DAA520]/28 bg-[#DAA520]/8 px-4 py-3 font-body text-sm text-[#F4C95D]">
                        {pedido.cliente.usuario.email}
                        {pedido.cliente.usuario.telefone
                          ? ` · ${pedido.cliente.usuario.telefone}`
                          : ""}
                      </div>
                      {telefoneLimpo && (
                        <a
                          href={`https://wa.me/${telefoneLimpo}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-400 px-4 py-2.5 font-body text-sm font-semibold text-[#05110b] transition-transform hover:scale-[1.01]"
                        >
                          <MessageCircle size={16} />
                          Chamar no WhatsApp
                        </a>
                      )}
                    </div>
                  ) : (
                    <DesbloquearBotao pedidoId={pedido.id} />
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {pedidosDesbloqueados.length > 0 && (
        <div className="mt-8 rounded-lg border border-white/10 px-4 py-3 font-body text-sm text-white/45">
          {pedidosDesbloqueados.length} contato(s) já estão prontos para avanço no
          pipeline.
        </div>
      )}
    </DashboardShell>
  );
}
