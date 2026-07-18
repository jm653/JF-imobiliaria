import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";
import AdicionarCreditosBotao from "@/components/area/AdicionarCreditosBotao";
import { Coins } from "lucide-react";

export default async function CreditosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel !== "corretor") redirect("/area-cliente");

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
    include: {
      desbloqueios: {
        include: { pedido: true },
        orderBy: { criadoEm: "desc" },
      },
    },
  });

  const creditos = perfilCorretor?.creditos ?? 0;

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <p className="jf-kicker">
        Créditos
      </p>
      <h1 className="mb-8 mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
        Sua energia na plataforma
      </h1>

      <div className="jf-panel-strong mb-10 rounded-lg p-8">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-[#DAA520]/15 p-4 shadow-[0_0_28px_rgba(218,165,32,0.18)]">
            <Coins className="text-[#DAA520]" size={28} />
          </div>
          <div>
            <p className="font-display text-4xl font-bold text-white">
              {creditos}
            </p>
            <p className="font-body text-sm text-white/50">
              créditos disponíveis
            </p>
          </div>
        </div>

        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#DAA520] to-[#F4C95D] transition-all"
            style={{
              width: `${Math.min((creditos / 100) * 100, 100)}%`,
            }}
          />
        </div>
        <p className="mt-1 font-mono text-[11px] text-white/30">
          referência visual: barra cheia = 100 créditos
        </p>

        <div className="mt-6">
          <AdicionarCreditosBotao />
        </div>
      </div>

      <h2 className="mb-4 font-display text-lg font-semibold text-white">
        Histórico de uso
      </h2>

      {!perfilCorretor?.desbloqueios.length && (
        <p className="font-body text-sm text-white/40">
          Nenhum crédito utilizado ainda.
        </p>
      )}

      <div className="space-y-3">
        {perfilCorretor?.desbloqueios.map((desbloqueio) => (
          <div
            key={desbloqueio.id}
            className="jf-panel flex items-center justify-between rounded-lg px-5 py-3"
          >
            <div>
              <p className="font-body text-sm text-white">
                Desbloqueio — {desbloqueio.pedido.cidade}
              </p>
              <p className="font-mono text-xs text-white/40">
                {desbloqueio.criadoEm.toLocaleDateString("pt-BR")}
              </p>
            </div>
            <span className="font-mono text-sm text-red-300">
              -{desbloqueio.creditosGastos}
            </span>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
