import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";
import DesbloquearBotao from "@/components/area/DesbloquearBotao";
import { Coins, Target, Unlock } from "lucide-react";

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

  const primeiroNome = session.user.name?.split(" ")[0] ?? "";

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#DAA520]">
          Área do Corretor
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Olá, {primeiroNome}
        </h1>
        <p className="mt-1 font-body text-sm text-white/50">
          {pedidosDisponiveis.length} clientes procurando imóveis que talvez
          você tenha.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-[#DAA520]/40 hover:bg-white/[0.05]">
          <Coins className="mb-3 text-[#DAA520]" size={22} />
          <p className="font-display text-2xl font-bold text-white">
            {perfilCorretor?.creditos ?? 0}
          </p>
          <p className="font-body text-sm text-white/50">
            Créditos disponíveis
          </p>
        </div>

        <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-[#DAA520]/40 hover:bg-white/[0.05]">
          <Target className="mb-3 text-[#DAA520]" size={22} />
          <p className="font-display text-2xl font-bold text-white">
            {pedidosDisponiveis.length}
          </p>
          <p className="font-body text-sm text-white/50">
            Oportunidades novas
          </p>
        </div>

        <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all hover:border-[#DAA520]/40 hover:bg-white/[0.05]">
          <Unlock className="mb-3 text-[#DAA520]" size={22} />
          <p className="font-display text-2xl font-bold text-white">
            {idsDesbloqueados.size}
          </p>
          <p className="font-body text-sm text-white/50">
            Contatos desbloqueados
          </p>
        </div>
      </div>

      <h2 className="mb-4 font-display text-lg font-semibold text-white">
        Oportunidades
      </h2>

      {!pedidos.length && (
        <p className="font-body text-sm text-white/40">
          Nenhum pedido publicado ainda.
        </p>
      )}

      <div className="space-y-4">
        {pedidos.map((pedido) => {
          const desbloqueado = idsDesbloqueados.has(pedido.id);
          return (
            <div
              key={pedido.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-[#DAA520]/30"
            >
              <p className="font-display font-semibold text-white">
                {pedido.cidade}
                {pedido.bairro ? ` — ${pedido.bairro}` : ""}
              </p>
              <p className="mt-1 font-body text-sm text-white/50">
                Até R$ {pedido.valorMaximo.toLocaleString("pt-BR")}
                {pedido.quartos ? ` · ${pedido.quartos} quartos` : ""}
                {pedido.banheiros ? ` · ${pedido.banheiros} banheiros` : ""}
              </p>

              <div className="mt-2 flex flex-wrap gap-2 font-body text-xs text-white/40">
                {pedido.garagem && <span>Garagem</span>}
                {pedido.varanda && <span>Varanda</span>}
                {pedido.quintal && <span>Quintal</span>}
                {pedido.aceitaPet && <span>Aceita pet</span>}
                {pedido.aceitaFinanciamento && <span>Financiamento</span>}
              </div>

              {pedido.descricaoLivre && (
                <p className="mt-3 font-body text-sm italic text-white/60">
                  &quot;{pedido.descricaoLivre}&quot;
                </p>
              )}

              <div className="mt-4">
                {desbloqueado ? (
                  <div className="rounded-lg border border-[#DAA520]/30 bg-[#DAA520]/10 px-4 py-2 font-body text-sm text-[#F4C95D]">
                    Contato: {pedido.cliente.usuario.email}
                    {pedido.cliente.usuario.telefone
                      ? ` · ${pedido.cliente.usuario.telefone}`
                      : ""}
                  </div>
                ) : (
                  <DesbloquearBotao pedidoId={pedido.id} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}