import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DashboardShell from "@/components/area/DashboardShell";
import Link from "next/link";

export default async function ConversasPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.papel !== "corretor") redirect("/area-cliente");

  const perfilCorretor = await prisma.perfilCorretor.findUnique({
    where: { usuarioId: session.user.id },
  });

  const desbloqueios = await prisma.desbloqueio.findMany({
    where: { corretorId: perfilCorretor?.id },
    include: {
      pedido: { include: { cliente: { include: { usuario: true } } } },
      mensagens: { orderBy: { criadoEm: "desc" }, take: 1 },
    },
    orderBy: { criadoEm: "desc" },
  });

  return (
    <DashboardShell nome={session.user.name ?? ""}>
      <div className="mb-8">
        <p className="jf-kicker">Conversas</p>
        <h1 className="mt-1 font-display text-2xl font-bold text-white sm:text-3xl">
          Suas conversas
        </h1>
      </div>

      {!desbloqueios.length && (
        <div className="jf-panel rounded-lg p-6 font-body text-sm text-white/45">
          Desbloqueie um contato em Oportunidades pra começar uma conversa.
        </div>
      )}

      <div className="space-y-3">
        {desbloqueios.map((d) => {
          const ultima = d.mensagens[0];
          return (
            <Link
              key={d.id}
              href={`/area/conversas/${d.id}`}
              className="jf-panel block rounded-lg p-5 transition-colors hover:border-[#DAA520]/35"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display font-semibold text-white">
                    {d.pedido.cliente.usuario.nome}
                  </p>
                  <p className="mt-1 truncate font-body text-sm text-white/50">
                    {ultima
                      ? ultima.conteudo
                      : `Sobre: ${d.pedido.cidade}${
                          d.pedido.bairro ? ` — ${d.pedido.bairro}` : ""
                        }`}
                  </p>
                </div>
                {ultima && (
                  <span className="shrink-0 font-mono text-xs text-white/30">
                    {ultima.criadoEm.toLocaleDateString("pt-BR")}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </DashboardShell>
  );
}