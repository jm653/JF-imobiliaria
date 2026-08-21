import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default async function NotificacoesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel !== "corretor") redirect("/area-cliente");

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
  });

  const notificacoes = await prisma.notificacao.findMany({
    where: { corretorId: perfilCorretor?.id },
    orderBy: { criadoEm: "desc" },
    take: 30,
  });

  const idsNaoLidas = notificacoes.filter((n) => !n.lida).map((n) => n.id);
  if (idsNaoLidas.length > 0) {
    await prisma.notificacao.updateMany({
      where: { id: { in: idsNaoLidas } },
      data: { lida: true },
    });
  }

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <div className="mb-8">
        <p className="jf-kicker">Notificações</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Avisos da IA
        </h1>
      </div>

      {!notificacoes.length && (
        <div className="jf-panel rounded-lg p-6 font-body text-sm text-white/45">
          Nenhuma notificação ainda. Assim que um pedido compatível com seus
          imóveis for publicado, você vai ver aqui.
        </div>
      )}

      <div className="space-y-3">
        {notificacoes.map((n) => (
          <Link
            key={n.id}
            href={n.link ?? "/area-corretor"}
            className={`block rounded-lg border p-5 transition-colors ${
              !n.lida
                ? "border-[#DAA520]/40 bg-[#DAA520]/8"
                : "jf-panel hover:border-[#DAA520]/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <Sparkles size={16} className="mt-0.5 shrink-0 text-[#F4C95D]" />
              <div className="min-w-0">
                <p className="font-body text-sm font-medium text-white">
                  {n.titulo}
                </p>
                <p className="mt-1 font-body text-sm text-white/55">
                  {n.mensagem}
                </p>
                <p className="mt-2 font-mono text-[11px] text-white/30">
                  {n.criadoEm.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </DashboardShell>
  );
}