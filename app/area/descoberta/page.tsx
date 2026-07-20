import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";
import DesbloquearBotao from "@/components/area/DesbloquearBotao";
import { Sparkles } from "lucide-react";

type PedidoComCliente = {
  id: string;
  cidade: string;
  bairro: string | null;
  valorMaximo: number;
  quartos: number | null;
  banheiros: number | null;
  garagem: boolean;
  varanda: boolean;
  quintal: boolean;
};

type ImovelDoCorretor = {
  id: string;
  titulo: string;
  cidade: string;
  valor: number;
  quartos: number | null;
  banheiros: number | null;
  garagem: boolean;
  varanda: boolean;
  quintal: boolean;
};

function calcularCompatibilidade(
  pedido: PedidoComCliente,
  imovel: ImovelDoCorretor
): number {
  if (pedido.cidade.trim().toLowerCase() !== imovel.cidade.trim().toLowerCase()) {
    return 0;
  }

  let pontos = 40;

  if (imovel.valor <= pedido.valorMaximo) {
    pontos += 25;
  } else {
    const excedente = (imovel.valor - pedido.valorMaximo) / pedido.valorMaximo;
    pontos += Math.max(0, 25 - excedente * 50);
  }

  if (pedido.quartos != null && imovel.quartos != null) {
    pontos += imovel.quartos >= pedido.quartos ? 15 : 5;
  } else {
    pontos += 10;
  }

  if (pedido.banheiros != null && imovel.banheiros != null) {
    pontos += imovel.banheiros >= pedido.banheiros ? 10 : 3;
  } else {
    pontos += 7;
  }

  pontos += pedido.garagem ? (imovel.garagem ? 3 : 0) : 3;
  pontos += pedido.varanda ? (imovel.varanda ? 3 : 0) : 3;
  pontos += pedido.quintal ? (imovel.quintal ? 2 : 0) : 2;

  return Math.min(Math.round(pontos), 99);
}

export default async function DescobertaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel !== "corretor") redirect("/area-cliente");

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
    include: { imoveis: true, desbloqueios: true },
  });

  const pedidos = await prisma.pedidoImovel.findMany({
    where: { status: "ativo" },
    include: { cliente: { include: { usuario: true } } },
  });

  const idsDesbloqueados = new Set(
    perfilCorretor?.desbloqueios.map((d) => d.pedidoId) ?? []
  );

  const meusImoveis = perfilCorretor?.imoveis ?? [];

  const oportunidades = pedidos
    .filter((p) => !idsDesbloqueados.has(p.id))
    .map((pedido) => {
      const melhorMatch = meusImoveis.reduce<{
        score: number;
        imovel: (typeof meusImoveis)[number] | null;
      }>(
        (melhor, imovel) => {
          const score = calcularCompatibilidade(pedido, imovel);
          return score > melhor.score ? { score, imovel } : melhor;
        },
        { score: 0, imovel: null }
      );

      return { pedido, ...melhorMatch };
    })
    .filter((o) => o.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <div className="mb-8">
        <p className="jf-kicker">Descoberta Inteligente</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Melhores oportunidades pra você
        </h1>
        <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-white/50">
          Cruzamos os seus imóveis anunciados com os pedidos ativos dos
          clientes, calculando compatibilidade real por cidade, valor,
          quartos e características — sem inventar porcentagem.
        </p>
      </div>

      {!meusImoveis.length && (
        <div className="jf-panel rounded-lg p-6 font-body text-sm text-white/45">
          Cadastre pelo menos um imóvel em <strong>Imóveis</strong> pra a
          Descoberta Inteligente começar a cruzar dados por você.
        </div>
      )}

      {meusImoveis.length > 0 && !oportunidades.length && (
        <div className="jf-panel rounded-lg p-6 font-body text-sm text-white/45">
          Nenhum pedido ativo é compatível com seus imóveis no momento.
        </div>
      )}

      <div className="space-y-4">
        {oportunidades.map(({ pedido, score, imovel }) => (
          <article key={pedido.id} className="jf-panel-strong rounded-lg p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#F4C95D]" />
                  <span className="font-mono text-xs text-[#F4C95D]">
                    {score}% compatível com &quot;{imovel?.titulo}&quot;
                  </span>
                </div>
                <p className="mt-2 font-display font-semibold text-white">
                  {pedido.cidade}
                  {pedido.bairro ? ` — ${pedido.bairro}` : ""}
                </p>
                <p className="mt-1 font-body text-sm text-white/52">
                  Até R$ {pedido.valorMaximo.toLocaleString("pt-BR")}
                  {pedido.quartos ? ` · ${pedido.quartos} quartos` : ""}
                  {pedido.banheiros ? ` · ${pedido.banheiros} banheiros` : ""}
                </p>

                <div className="mt-3 flex max-w-sm items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/7">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#DAA520] to-[#F4C95D]"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full shrink-0 lg:w-56">
                <DesbloquearBotao pedidoId={pedido.id} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}